// setup routes
//
var	
	//databaseUrl = "mydb", // "username:password@example.com/mydb"
  databaseUrl = "mongodb://mofish58:mogwai58@ds029960.mongolab.com:29960/mofish",
	collections = [ "eQuotes", "ZipCodeCity", "Districts", "Accounts", "MbmaFips" ],
	db = require("mongojs").connect(databaseUrl, collections);

function sortByProperty(property) {
    'use strict';
    return function (a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
 
        return sortStatus;
    };
}

var configRoutes = function( app, server ) {

	app.get( '/', function ( request, response ) {
		response.redirect( '/index.html' );
	});

	/* note that this is using an ":obj_type" parameter for the route 
	   this is not really necessary, since know this is an eQuotes route... but
	   still going to use it anyway to show flexibility of how to do routes

	   also: we'll need to adjust the route parameters to query a specific set of quotes
	*/

	app.get( '/:obj_type/list1', function ( request, response ) {
		db.eQuotes.find({ Wid: { $gt: 600, $lt: 2400 }}, 
			function(err, myQuotes ) {
  				if(err || !myQuotes) console.log("No quotes found: " + err);
  				else response.send( myQuotes );
  			});
	});

	app.get( '/:obj_type/list/:width/:bays', function ( req, res ) {
		db.eQuotes.find({ Wid: { $gt: parseFloat(req.params.width) - 10.0, $lt: parseFloat(req.params.width) + 10.0 },
		                  Bays: parseInt(req.params.bays) },
			function(err, myQuotes ) {
  				if(err || !myQuotes) console.log("No quotes found: " + err);
  				else {
  					myQuotes.sort(sortByProperty('Bays'));
  					res.send( myQuotes );
  				}
  			});
	});

	app.get( '/:obj_type/estm/:width/:bays', function ( req, res ) {
		db.eQuotes.find({ Wid: { $gt: parseFloat(req.params.width) - 10.0, $lt: parseFloat(req.params.width) + 10.0 },
		                  Bays: parseInt(req.params.bays) },
			function(err, myQuotes ) {
  				if(err || !myQuotes) console.log("No quotes found: " + err);
  				else {
  					myQuotes.sort(sortByProperty('Bays'));
  					res.send( myQuotes );
  				}
  			});
	});

	app.get( '/:obj_type/bybays/:bays', function ( req, res ) {
		db.eQuotes.find( { Bays: parseInt(req.params.bays) },
			function(err, myQuotes ) {
  				if(err || !myQuotes) console.log("No quotes found: " + err);
  				else {
  					res.send( myQuotes );
  				}
  			});
	});

	app.get( '/:obj_type/dm/:zip', function ( req, res ) {
    // see if we can tell who the user is
    console.log('current user=' + req.user);
		db.ZipCodeCity.find( { ZipCode: req.params.zip },
			function(err, myCity ) {
  				if(err || !myCity) console.log('No city found for zip: ' + err);
  				else 
  				{
  					//console.log(myCity);
  					// get the MBMA data based upon the FIPS code
  					db.MbmaFips.find( { FIPS_Id: myCity[0].FIPS },
  						function(err, myMBMA) {
  							if (err || !myMBMA) console.log('No MBMA found for: ' + myCity);
  							else {
  								//console.log(myMBMA);
  								// get the disctrict; which has the user account we need
  								db.Districts.find( { DistrictNumber: myMBMA[0].DM },
  									function(err, myDistrict) {
  										if (err || !myDistrict) console.log('No District found');
  										else {
                        //console.log(myDistrict);
                        db.Accounts.find( { UserId: parseInt(myDistrict[0].DMUserId) },
  											   function(err, myAccount) {
                              if (err || !myAccount) console.log('No Account found');
                              else {
                                //console.log(myAccount);
                                myAccount[0].Username = myDistrict[0].Name; // switch the username with real name
                                res.send(myAccount);
                              }
                           }
                        )
  										}
  									}
  								)
  							}
  						}
  					)
  				}
  			});
	});
};
module.exports = { configRoutes : configRoutes };