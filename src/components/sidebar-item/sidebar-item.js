import React, { PureComponent } from "react";
import { Accordion, Menu, Icon } from "semantic-ui-react";

//Styles
import "./sidebar-item.css";

class SidebarItem extends PureComponent {
  render() {
    const {
      name,
      icon,
      label,
      index,
      activeClass,
      onClick,
      active
    } = this.props;

    return (
      <Menu.Item className={activeClass}>
        <Accordion.Title
          active={active}
          className="sidebar-menu-item-title"
          index={index}
          name={name}
          onClick={onClick}
        >
          <div>
            <Icon name={icon} className="sidebar-menu-item-title-icon" />
            {label}
          </div>
        </Accordion.Title>
      </Menu.Item>
    );
  }
}

export default SidebarItem;
