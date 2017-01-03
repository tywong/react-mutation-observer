import React, {Component} from 'react';
import Waypoint from 'react-waypoint';
import uuid from 'uuid';

export default class Test extends Component {
  constructor() {
    super();
    this.id = uuid.v4();
  }


  render() {
    const style = {
      marginTop: '40px',
      display: this.props.display
    }

    // Use setTimeout(cb, 0) to make the call becomes async
    return (
      <div>
        <Waypoint
          onEnter={
            () => { setTimeout( () => this.props.onEnter(this.id, this.node.style.display, this.props.reactKey), 0); }
          }
          onLeave={
            () => { setTimeout( () => this.props.onLeave(this.id, this.node.style.display, this.props.reactKey), 0); }
          }
        />

        <div style={style} data-id={ this.id} ref={ (node) => {this.node = node;} }>
          Hello {this.props.reactKey}
        </div>
      </div>
    );
  }
}
