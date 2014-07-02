/** @jsx React.DOM */

var IQuote = React.createClass({
  getInitialState: function(){
    return {
        //this.setState( { currentUser: 'who am I?' } );
    };
  },
  listIQuote: function(){

      var tablist = [];
      var bays = 3;
      var width = 60 * 12;

      width = document.getElementById('Width').value
      bays = document.getElementById('Bays').value

      var length = document.getElementById('Length').value
      var eave = document.getElementById('Eave').value
      var zip = document.getElementById('Zip').value
      var standingSeam = document.getElementById('StandingSeam').value

      var url = './eQuotes/estm/' + width * 12 + "/" + bays;

      var count = 0;
      $.getJSON(url, function(data){

          $.each(data, function (index, d) {
            count++;
            var width = d.Wid / 12.0;
            var length = d.Len / 12.0;

            tablist.push({ Count: count, Quote: d.QNum, Price: '$' + d.Prc, Description: d.Name, Bays: d.Bays, Width: width.toFixed(2), Length: length.toFixed(2), Weight: d.Wgt });
          });

          var tableData = ConvertJsonToTable(tablist, 'jsonTable', null, 'Download', '');
  
          var tdiv = document.getElementById('spanQuotes');
          tdiv.innerHTML = tableData;
       }.bind(this));
  },
  getIQuote: function(){
    
      var tablist = [];

      var zip = document.getElementById('Zip').value

      // this is cheezy, but get thh contact information first
      // eventually, we want to combine this in to one ajax call vs. two
      //
      var url = './eQuotes/dm/' + zip;
      $.getJSON(url, function(data) {
          this.setState( { contactName: data[0].Username } );  
          this.setState( { contactEmail: data[0].Email } );
          this.setState( { contactPhone: data[0].Phone } );

          document.getElementById('spanDM').innerHTML =
           '<a href="mailto:' + data[0].Email + '">' + data[0].Username + '</a> - ' + data[0].Phone;

       }.bind(this));

      // now get the average buildings
      //
      width = document.getElementById('Width').value
      bays = document.getElementById('Bays').value

      var length = document.getElementById('Length').value
      var eave = document.getElementById('Eave').value
      var standingSeam = document.getElementById('StandingSeam').value

      url = './eQuotes/estm/' + width * 12 + "/" + bays;
      var totalPrice = 0.0;
      var count = 0;

      $.getJSON(url, function(data){

          $.each(data, function (index, d) {
              count++;
              totalPrice += d.Prc;      
           });

          totalPrice = totalPrice / count;
          this.setState( { priceMsg: '$' + totalPrice.toFixed(0)} );  

       }.bind(this));
  },
  render: function() {
    return (
      <div className='iquote' class='iquote'>
        <Title name={this.props.name} />
        
        <table id='jsonTable'>
          <tr>
            <th>Width</th><th>Length</th><th>Eave</th><th>Bays</th><th>Seamed</th><th>Color</th><th>Zip</th><th/>
          </tr>
          <tr>
            <td><input type="text" name="Width" id="Width" size="4" defaultValue="60" /></td>
            <td><input type="text" name="Length" id="Length" size="4" defaultValue="100" /></td>
            <td><input type="text" name="Eave" id="Eave" size="4" defaultValue="20" /></td>
            <td><input type="text" name="Bays" id="Bays" size="2" defaultValue="4" /></td>
            <td><input type="text" name="StandingSeam" id="StandingSeam" size="1" defaultValue="1" /></td>
            <td><input type="text" name="Color" id="Color" size="2" defaultValue="ZA" /></td>
            <td><input type="text" name="Zip" id="Zip" size="5" defaultValue="42103" /></td>
            <td><button onClick={this.getIQuote}>Get iQuote</button></td>
          </tr>
        </table>

        <div id="divQuote" class="iquote"><strong>Avg Price: </strong>{this.state.priceMsg}</div>
        <div id="divSalesContact" class="iquote"><strong>Sales Contact: </strong><span id="spanDM"></span></div>
        <button onClick={this.listIQuote}>List Quotes</button>
        <div><span id="spanUser">{this.state.currentUser}</span></div>
        <div><span id="spanQuotes"></span></div>
      </div>
    );
  }
});
