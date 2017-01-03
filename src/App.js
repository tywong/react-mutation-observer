import React, { Component } from 'react';
import Test from './Test'

class App extends Component {
  constructor() {
    super();
    this.state = {
      elements: 0,
      display: 'block',
      visibleElements: {}
    };
  }

  componentDidMount() {
    const observer = new MutationObserver(
      (mutations) => {
        console.log('observer');
        const visibleElements = Object.assign({}, this.state.visibleElements);

        mutations.forEach( (m) => {
          if(m.type === 'attributes') {
            const id = m.target.getAttribute('data-id');
            const content = visibleElements[id];

            if(content === undefined) {
              return;
            }

            visibleElements[id].display = m.target.style.display;
            // if(visibleElements[id].display === 'none') {
            //   visibleElements[id].visible = false;
            // }
          }
          else if(m.type === 'childList') {
            if(m.addedNodes.length === 0)
              return;

            const id = m.target.getAttribute('data-id');
            visibleElements[id] = {
              display: m.target.style.display
            };
          }
        } );

        const displayArray = Object.keys(visibleElements)
          .filter( id => visibleElements[id].visible && visibleElements[id].display !== 'none')
          .map( id => visibleElements[id].reactKey );

        console.log(displayArray);

        this.setState({
          ...this.state,
          visibleElements
        });
      }
    );

    observer.observe(this.node, {
      childList : true,
      subtree : true,
      attributes: true
    });

    this.setState({
      ...this.state,
      observer
    });

  }

  toggleDisplay(id) {
    let display = '';
    if(this.state.display === 'block') {
      display = 'none';
    }
    else{
      display = 'block';
    }

    this.setState( {
      ...this.state,
      display
    } );
  }

  addTest() {
    this.setState ({
      ...this.state,
      elements: this.state.elements + 1
    });
  }

  removeTest() {
    if(this.state.elements > 0) {
      this.setState ({
        ...this.state,
        elements: this.state.elements - 1
      });
    }
  }

  onWayPoint(visible) {
    console.log('wayPoint');

    return (id, display, reactKey) => {
      const visibleElements = {
        ...this.state.visibleElements,
        [id]: {
          visible,
          reactKey,
          display
        }
      };

      this.setState({
        ...this.state,
        visibleElements
      });

      const displayArray = Object.keys(visibleElements)
        .filter( id => visibleElements[id].visible && visibleElements[id].display !== 'none')
        .map( id => visibleElements[id].reactKey );

      console.log(displayArray);
    };
  }

  onEnter(id, display,reactKey) {
    return this.onWayPoint(true)(id, display,reactKey);
  }

  onLeave(id, display,reactKey) {
    return this.onWayPoint(false)(id, display,reactKey);
  }

  render() {
    let elements = [];
    for(let i = 0; i < this.state.elements; i++) {
      elements.push(
        <Test
          key={i}
          reactKey={i}
          display={this.state.display}
          onEnter={ this.onEnter.bind(this) }
          onLeave={ this.onLeave.bind(this) }
          />
      );
    }

    return (
      <div ref={ (node) => {this.node = node;} }>

        <p>
          <button onClick={ () => this.addTest() }>+ Element {this.state.elements}</button>
            <button onClick={ () => this.removeTest() }>- Element {this.state.elements}</button>
          <button onClick={ () => this.toggleDisplay() }>Display {this.state.display}</button>
        </p>

        {elements}

      </div>
    );
  }
}

export default App;
