import { ILuisService, IDispatchService } from '@bfemulator/sdk-shared';
import { css, StyleAttribute } from 'glamor';
import * as React from 'react';
import { ComponentClass, MouseEventHandler, SyntheticEvent } from 'react';
import { ServicePane, ServicePaneProps } from '../servicePane';
import { LuisModelsViewerContainer } from './luisModelsViewerDialog';

interface LuisExplorerProps extends ServicePaneProps {
  services: ILuisService[] | IDispatchService[];
  openDeepLink: ( service: ILuisService | IDispatchService) => void;
  launchServiceViewer: (viewer: ComponentClass<any>) => void;
}

export class LuisExplorer extends ServicePane<LuisExplorerProps> {
  constructor(props, context) {
    super(props, context);
  }

  protected get links(): JSX.Element[] {
    const { services = [] } = this.props;
    return services
      .map((model, index) => {
        return <li key={ index } onClick={ this.onLinkClick } data-index={ index }>{ model.name } <span>- version { model.version }</span></li>;
      });
  }

  protected get componentCss(): StyleAttribute {
    const componentCss = super.componentCss;
    const overrides = css({
      '& .addIconButton': {
        display: 'none'
      }
    });

    return css(componentCss, overrides);
  }

  protected onLinkClick: MouseEventHandler<HTMLLIElement> = (event: SyntheticEvent<HTMLLIElement>): void => {
    const { currentTarget } = event;
    const { index } = currentTarget.dataset;
    const { [index]: luisModel } = this.props.services;
    this.props.openDeepLink(luisModel);
  };

  protected onContextMenuOverLiElement(li: HTMLLIElement) {
    super.onContextMenuOverLiElement(li);
    const { index } = li.dataset;
    const { [index]: service } = this.props.services;
    this.props.openContextMenu(service);
  }

  protected onAddIconClick = (event: SyntheticEvent<HTMLButtonElement>): void => {
    this.props.launchServiceViewer(LuisModelsViewerContainer);
  };
}
