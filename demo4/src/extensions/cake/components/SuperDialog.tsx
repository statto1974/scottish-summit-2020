import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog } from '@microsoft/sp-dialog';

import { getId } from 'office-ui-fabric-react/lib/Utilities';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal
} from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Text } from 'office-ui-fabric-react/lib/Text';

interface IUserInputDialogProps {
  cakeName: string;
  onDismiss: () => void;
}

export interface ISuperDialogContentState {
  showModal: boolean;
}

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    backgroundImage: 'url(https://your-tenant.sharepoint.com/sites/Demo4/SiteAssets/hypnotoad.gif)',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'repeat',
    height: '800px',
    width: '800px'
  },
  header: [
    // tslint:disable-next-line:deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      fontSize: FontSizes.xLarge,
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
      backgroundColor: '#fff'
    }
  ],
  body: {
    flex: '4 4 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: {
        margin: '14px 0'
      },
      'p:first-child': {
        marginTop: 0
      },
      'p:last-child': {
        marginBottom: 0
      }
    }
  },
  inner: {
    marginTop: '100px',
    backgroundColor: '#fff',
    padding: '20px 20px 20px 20px'
  }
});


class SuperDialogContent extends 
  React.Component<IUserInputDialogProps, ISuperDialogContentState> {

    private _titleId: string = getId('title');
    private _subtitleId: string = getId('subText');

    constructor(props : IUserInputDialogProps) {
      super(props);

      this.state = {
        showModal : true
      };
    }

    public render(): JSX.Element {
      return (
        <Modal
          titleAriaId={this.props.cakeName}
          isOpen={true}
          onDismiss={this.props.onDismiss}
          isBlocking={true}
          containerClassName={contentStyles.container}
        >
          <div className={contentStyles.header}>
            <span id={this._titleId}>Lorem Ipsum</span>
          </div>
          <div id={this._subtitleId} className={contentStyles.body}>
            <div className={contentStyles.inner}>
              <form>
                <p>
                  <Text>
                    What did you think of {this.props.cakeName} cake?
                  </Text>
                </p>
                <p>
                  <TextField label="Your verdict" />
                </p>
                <PrimaryButton onClick={this.props.onDismiss}>Send you verdict</PrimaryButton>
            </form>
          </div>
          </div>
        </Modal>
      );
    }

    private onDismiss(ev: any)
    {
        this.props.onDismiss();
    }
}

export default class SuperDialog extends BaseDialog {

  public cakeName: string;

  public render(): void {        
    ReactDOM.render(
      <SuperDialogContent
        cakeName={this.cakeName}
        onDismiss={this.onDismiss.bind(this)}
      />, 
      this.domElement
    );
  }

  private onDismiss()
  {
      ReactDOM.unmountComponentAtNode(this.domElement);
      this.close();
  }
}



