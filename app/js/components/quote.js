/** @jsx React.DOM */

var Quote = React.createClass({
  getInitialState: function(){
    return {};
  },
  getWeather: function(){
    var url = "http://api.wunderground.com/api/aad218fcd659a15a/conditions/q/"+this.props.zip+".json?callback=?";
    $.getJSON(url, function(data){
      this.setState({temp: data.current_observation.temp_f});
    }.bind(this));
  },
  getQuote: function(){
    var symbols = ["AAPL", "NFLX", "NUE"];
    var tablist = [];
    for(i = 0; i < symbols.length; i++) {
      var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + symbols[i] + '&callback=?';
      $.getJSON(url, function(data){
          tablist.push({ NAME: data.Name, LAST: data.LastPrice, SYMBOL: data.Symbol });
          var tableData = ConvertJsonToTable(tablist, 'jsonTable', null, 'Download', '');
          /*this.setState({stock: tableData});*/
          var tdiv = document.getElementById('sQuote');
          tdiv.innerHTML = tableData;
       }.bind(this));
    }
  },
  getIQuote: function(){
    var tablist = [];
      var url = './eQuotes/list';
      $.getJSON(url, function(data){

          $.each(data, function (index, d) {
            var width = d.Wid / 12.0;
            var length = d.Len / 12.0;
            tablist.push({ Name: d.Name, Bays: d.Bays, Width: width.toFixed(2), Length: length.toFixed(2), Price: d.Prc, Weight: d.Wgt });
          });

          var tableData = ConvertJsonToTable(tablist, 'jsonTable', null, 'Download', '');
  
          var tdiv = document.getElementById('sQuote');
          tdiv.innerHTML = tableData;
       }.bind(this));
  },
  render: function() {
    return (
      <div className='quote'>
        <Title name={this.props.name} />
        <button onClick={this.getQuote}>Get Quote</button><br/>
        <button onClick={this.getIQuote}>Get iQuote</button>
        <div><span id="sQuote"></span></div>
        <div id="divQuote">{this.state.stock}</div>
      </div>
    );
  }
});
