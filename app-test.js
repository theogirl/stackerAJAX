$(document).ready(function() {

//------EVENTS--------//
	$('.unanswered-getter').submit( function(event){
		$('.results').html('');
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});


	$('.inspiration-getter').submit( function(event){
		$('.results').html('');
		var tagsTop = $(this).find("input[name='answerers']").val();
		alert(tagsTop);
		
	});

//------FUNCTIONS--------//

var showSearchResults = function(query, resultNum) { 
	var results = resultNum + ' results for: <strong>' + query;
	return results;
};//end showSearchResults

var showQuestion = function(question) {
	
	var result = $('.templates .question').clone();
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link); 
	questionElem.text(question.title);

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


var getUnanswered = function(tags) {
	
	var request = {tagged: tags, site: 'stackoverflow',	order: 'desc', sort: 'creation'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
	})//end done
	.fail(function() {

	});//end result

});//end getUnanswered function

}); //end document ready