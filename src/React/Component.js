export default class Component {
  currentProps = {};

  constructor(props) {
    this.currentProps = props;
    if (this.constructor === Component) {
        throw new Error("Can't instantiate Component.");
    }
  }

  display(newProps) {
    if (this.shouldUpdate(newProps)) {
      return this.render();
    }
  }

  shouldUpdate(newProps) {
    if(JSON.stringify(newProps) !== JSON.stringify(this.currentProps)) {
        this.currentProps = newProps;
        return true;
    }
    return false;
  }
  
  render() {
    throw new Error("render() need to be implemented");
  }
}