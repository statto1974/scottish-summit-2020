import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface IUserInputProps {
  cakeName: string;
}

export class UserInput extends React.Component<IUserInputProps, {}> { 

  public render(): JSX.Element {

    return (
      <Panel 
        isOpen={true}
        type={PanelType.medium}
        headerText='Verdict'
        closeButtonAriaLabel='Close'>
        <form>
          <p>
            <Text>
              What did you think of {this.props.cakeName} cake?
            </Text>
          </p>
          <p>
            <TextField label="Your verdict" />
          </p>
          <PrimaryButton>Send you verdict</PrimaryButton>
        </form>
      </Panel>
    );

  }
}