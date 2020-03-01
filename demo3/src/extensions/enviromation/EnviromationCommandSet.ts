import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
  RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'EnviromationCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IEnviromationCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'EnviromationCommandSet';

export default class EnviromationCommandSet extends BaseListViewCommandSet<IEnviromationCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized EnviromationCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    
    // if you don't do anything, your command will be shown for none, one or multiple selections

    // get the command for nothing selected
    const compareNoSelCommand: Command = this.tryGetCommand('COMMAND_NO_SEL');
    if (compareNoSelCommand) {

      // will only show if nothing has been selected
      compareNoSelCommand.visible = event.selectedRows.length === 0;
    }

    // get the command for one selection
    const compareOneSelCommand: Command = this.tryGetCommand('COMMAND_ONE_SEL');
    if (compareOneSelCommand) {
      
      // will only show if one row is selected
      compareOneSelCommand.visible = event.selectedRows.length === 1;
    }

    // get the command for more than one selected
    const compareMoreThanOneSelCommand: Command = this.tryGetCommand('COMMAND_MORE_THAN_ONE_SEL');
    if (compareMoreThanOneSelCommand) {

      // will only show if more than one is selected
      // use the line below if you want 1 or more selected
      // compareMoreThanOneSelCommand.visible = event.selectedRows.length > 0;
      compareMoreThanOneSelCommand.visible = event.selectedRows.length > 1;
    }

    // get the command for a certain content type
    const compareContentTypeCommand: Command = this.tryGetCommand('COMMAND_CONTENT_TYPE');
    if (compareContentTypeCommand) {
      
      // need to make sure it's only one row selected
      // ContentTypeId is always returned in selectedRows.
      // use startsWith if you want Content Type and all it's children
      // use === if you want that content type only
      const isVisible: boolean = 
        event.selectedRows.length === 1 
        && event.selectedRows[0].getValueByName("ContentTypeId").startsWith('0x0100DF95576F4D99B446AC529A20EB69DA9E');
      
        compareContentTypeCommand.visible = isVisible;
    }

    // get the command for a field value in selected row
    const compareFieldValCommand: Command = this.tryGetCommand('COMMAND_FIELD_VAL');
    if (compareFieldValCommand) {
      
      // check one is selected
      // check field is in view
      // check agaist value
      const isVisible: boolean =
        event.selectedRows.length === 1
        && event.selectedRows[0].fields.filter(f => f.displayName === 'Price').length > 0
        && event.selectedRows[0].getValueByName('Price') === '2.35';

      compareFieldValCommand.visible = isVisible;
    }

    // showing selection on loading data is in demo5
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_NO_SEL':
        Dialog.alert('Nada');
        break;
      case 'COMMAND_ONE_SEL':
        Dialog.alert('Numero Uno');
        break;
      case 'COMMAND_MORE_THAN_ONE_SEL':

        // loop some rows here

        Dialog.alert('Clever, more than one thing selected');
        break;
      case 'COMMAND_CONTENT_TYPE':
        Dialog.alert("Now you are getting it, coffee content type selected");
        break;
      case 'COMMAND_FIELD_VAL':
        Dialog.alert("This is from Mexico");
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
 