/** @jsx React.DOM */

var Clock = React.createClass({
  getInitialState: function(){
    return {seconds: 0};
  },
  startTimer: function(){
    clearInterval(this.timer);
    this.timer = setInterval(function(){
      this.setState({seconds: this.state.seconds + 1});
    }.bind(this), 1000);
  },
  stopTimer: function(){
    clearInterval(this.timer);
    var symbol = 'AAPL';
    var tablist = [];
    var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=?';
    $.getJSON(url, function(data){
          tablist.push({ NAME: data.Name, LAST: data.LastPrice, SYMBOL: data.Symbol });
          var tableData = ConvertJsonToTable(tablist, 'jsonTable', null, 'Download', '');
          var tdiv = document.getElementById('divStock');
          tdiv.innerHTML = tableData;         
    }.bind(this));
  },
  render: function() {
    return (
      <div className='clock'>
        <Title name={this.props.face} />
        <button onClick={this.startTimer}>Start</button>
        <button onClick={this.stopTimer}>Stop</button>
        <div><span>{this.state.seconds}</span> <span>seconds</span><span id="divStock"> {this.state.stock}</span></div>
      </div>
    );
  }
});
