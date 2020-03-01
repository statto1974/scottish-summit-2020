import * as React from 'react';
import * as ReactDom from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';

import { UserInput, IUserInputProps } from './components/UserInput';
import SuperDialog from './components/SuperDialog';

import * as strings from 'CakeCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICakeCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CakeCommandSet';

export default class CakeCommandSet extends BaseListViewCommandSet<ICakeCommandSetProperties> {

  private _domElement: Element; 

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CakeCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }

    const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    if (compareTwoCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareTwoCommand.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':

        this._domElement = document.createElement('div');

        const props: IUserInputProps = {
          cakeName : event.selectedRows[0].getValueByName('Title'),
        };

        const reactElement: React.ReactElement<IUserInputProps> = React.createElement(UserInput, props);
        ReactDom.render(reactElement, this._domElement);
        
        break;

      case 'COMMAND_2':

          const dialog: SuperDialog = new SuperDialog();
          dialog.show();

          break;
      default:
        throw new Error('Unknown command');
    }
  }

  @override
  public onDispose(): void {

    ReactDom.unmountComponentAtNode(this._domElement);

    this.dispose();
  }
}
