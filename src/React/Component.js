class Component {
  currentProps = [];

  display(newProps) {
    if (shouldUpdate(newProps)) {
      return this.render()
    }
  }

  shouldUpdate(newProps, currentProps) {
    return newProps !== currentProps;
  }
  
  render() {}
}

class Home extends Component {
  render() {
    return React.createElement('div', null, Component, 'test');
  }
}