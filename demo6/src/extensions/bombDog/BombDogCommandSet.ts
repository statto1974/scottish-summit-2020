import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import { sp } from "@pnp/sp/presets/all";

import * as strings from 'BombDogCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBombDogCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'BombDogCommandSet';

export default class BombDogCommandSet extends BaseListViewCommandSet<IBombDogCommandSetProperties> {

  // used to store the available staff
  private _available: string[];

  @override
  public async onInit(): Promise<void> {
    
    // wait for this the component to do it's stuff
    await super.onInit();

    // setup PnP with the component context
    sp.setup({
      spfxContext: this.context
    });

    // make a call to the staff list to get available staff 
    const staff: any[] = await sp.web.lists.getByTitle("Staff").getItemsByCAMLQuery({
      ViewXml: `<View><Query><Where><Eq><FieldRef Name="Available"/><Value Type="Integer">1</Value></Eq></Where></Query></View>`,
    });

    // if we have staff then map to global variable
    if (staff && staff.length > 0) {
      this._available = staff.map(s => s.Title);
    }

    // resolve a promise to make things good again
    return Promise.resolve<void>();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    
    // with have 5 commands set in the manifest
    // all end in a number from 1 to 5 i.e. COMMAND_1, COMMAND_2, etc.
    for (let i = 1; i <= 5; i++) {
      
      const staffCommand: Command = this.tryGetCommand(`STAFF_${i}`);

      if (staffCommand) {

        // set the label to the name of the staff member
        staffCommand.ariaLabel = this._available[i-1];
        staffCommand.title = this._available[i-1];

        // check for 1 row and number of available staff 
        // can show a maximum of 5 staff, but if less then hide unused commands
        if (this._available.length >= i && event.selectedRows.length === 1) {
          
          // show command
          staffCommand.visible = true;
        } else {
          staffCommand.visible = false;
        }
      }
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {

    // get the number part from the command name
    const number: number =  +event.itemId.split('_')[1];

    if (number <= this._available.length) {

      // maybe call an external API or something here

      Dialog.alert(`${this._available[number-1]} is booked on the shift`);
    }
  }
}
