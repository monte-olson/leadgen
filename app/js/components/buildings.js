/** @jsx React.DOM */

var Buildings = React.createClass({
  render: function() {
    return <img src={"/media/buildings/" + this.props.name + ".jpg"} />;
  }
});