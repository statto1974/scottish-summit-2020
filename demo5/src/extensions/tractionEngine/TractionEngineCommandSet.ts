import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import { HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http'; 

import * as strings from 'TractionEngineCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITractionEngineCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'TractionEngineCommandSet';

export default class TractionEngineCommandSet extends BaseListViewCommandSet<ITractionEngineCommandSetProperties> {

  // global variable to store available lorries
  private _lorries: Lorry[];

  @override
  public async onInit(): Promise<void> {

    // wait for component initiation
    await super.onInit();

    // call our azure function
    const response: HttpClientResponse = 
      await this.context.httpClient.get(
        'https://your-function.azurewebsites.net/api/HttpTrigger1?code=<<access-code>>', 
        HttpClient.configurations.v1
      );

    const json = await response.text();

    // store returned lorries in global variable
    this._lorries = JSON.parse(json)

    return Promise.resolve<void>();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {

    // with have five command slots
    for (let i = 1; i <= 5; i++) {
      
      // intially hide all the commands
      const compareCommand: Command = this.tryGetCommand(`LORRY_${i}`);

      if (compareCommand) {
        compareCommand.visible = false;
      }
    }

    // if one row selected and that row hasn't already been allocated
    if (event.selectedRows.length === 1 && event.selectedRows[0].getValueByName("Allocated") === "No") {

      // loop available lorries
      this._lorries.forEach(l => {

        // if allocated lorry exists then make visible
        const command: Command = this.tryGetCommand(l.code);
  
        if (command) {
          command.visible = true;
        }
      });
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {

    // get the selected lorry
    const lorry: Lorry = this._lorries.filter(l => l.code === event.itemId)[0];

    // create an allocate object to post
    const allocate: Allocate = {
      listId: event.selectedRows[0].getValueByName("ID"),
      lorry: lorry.name
    }

    // stringify that badboy
    const body: string = JSON.stringify(allocate);

    // create headers & options
    const headers: Headers = new Headers();
    headers.append('Content-type', 'application/json');

    const options: IHttpClientOptions = {
      body: body,
      headers: headers
    };

    // post to Power Automate http endpoint
    this.context.httpClient.post(
      'https://flow-http-endpoinnt', 
      HttpClient.configurations.v1,
      options
    ).then(_ => {
      Dialog.alert(`${lorry.name} allocated`);
    });
  }
}

// data descriptors
class Lorry {
  id: string;
  code: string;
  name: string;
}

class Allocate {
  listId: string;
  lorry: string;
}

