class Component {
  currentProps = [];

  display(newProps) {
    if(shouldUpdate(newProps)) {}
  }

  shouldUpdate(newProps, currentProps) {
    return newProps !== currentProps;
  }
  
  render() {}
}