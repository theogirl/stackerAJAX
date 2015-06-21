$(document).ready( function() {

//------EVENTS--------//
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});


	$('.inspiration-getter').submit( function(event){
		$('.results').html('');
		var tagsTop = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tags); 
	});



// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link); //gets the question URL info from returned object
	questionElem.text(question.title);// gets the question title from the returned object

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date); //why new? why 1000*??
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
	question.owner.display_name +'</a>' +'</p>' +'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
}; //end showQuestion function


//NEW FUNCTION//
//---creates a function value that contains the relevant info to dispay
//---for the top answerers for the queried tag(s)

var showAnswerer = function(answerer) {
	
	var result = $('.templates .answerers').clone();
	
	var nameElem = result.find('.answerer-name a');
	nameElem.attr('href', answerer.link); //gets the answerer's profile URL info from returned object
	nameElem.text(answerer.display_name);// gets the answerer's user name from the returned object

	var reputation = result.find('.answerer-reputation');
	reputation.text(answerer.reputation);

	return result;
};//end showAnswerer function


// this function takes the returned object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) { 
	var results = resultNum + ' results for: <strong>' + query; //where is resultNum and query defined?? Oh, down below in .done()
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	//this var represents the underlying object returned by the AJAX request
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
	//this is the callback function that is called when
	//the data object is returned successfully
	.done(function(result){

		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) { //what is "i" here??
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	//this is the callback function that is called ONLY if
	//the AJAX request fails!
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});


//---new Function that finds top answerers for a topic
//---creates a function value that can then be passed and displayed

var getTopAnswerers = function(tags) {
	

	var requestTop = {tagged: tags,	site: 'stackoverflow', order: 'desc', sort: 'votes'};

	var returnedTop = $.ajax({url: "http://api.stackexchange.com/2.2/top-answerers/all_time?site=stackoverflow", data: requestTop, dataType: "jsonp", type: "GET" }).done(function(returnedTop){
		
		var searchResults = showSearchResults(requestTop.tagged, returnedTop.items.length);

		$('.search-results').html(searchResults);//this updates the yellow search results # area

		$.each(returnedTop.items, function(i, item) { //what is "i" here??
			var answerer = showAnswerer(item);
			$('.results').append(answerer);
		});
	}).fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});
	};
}; //end document ready
