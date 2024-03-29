$('.title').html("<h1>Train Time</h1><h3>All Aboard</h3>")

var firebaseConfig = {
  apiKey: "AIzaSyD4HSAQLrhd23G3Oa2mDUmgvnLk6_fkbjg",
  authDomain: "pauls-clicker.firebaseapp.com",
  databaseURL: "https://pauls-clicker.firebaseio.com",
  projectId: "pauls-clicker",
  storageBucket: "",
  messagingSenderId: "781034788189",
  appId: "1:781034788189:web:2379fc2cbf784a382044b4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  // Get a reference to the database service
  var database = firebase.database();

$tableTitle = $('<div>')
$tableTitle.html('<h4>Current Train Schedule</h4>')
$tableTitle.addClass("bg-primary text-light container pt-1 pb-1 card ")
$('#train-table').prepend($tableTitle);

$trainTable = $('<table>')
$trainTable.addClass("table container table-hover border border-primary")
$thead = $('<thead>')
$topRow = $('<tr>')

$th1 = $('<th>')
$th1.attr({
  scope: "col"
})
$th1.text("Train Name")

$th2 = $('<th>')
$th2.attr({
  scope: "col"
})
$th2.text("Destination")

$th3 = $('<th>')
$th3.attr({
  scope: "col"
})
$th3.text("Frequency (min)")

$th4 = $('<th>')
$th4.attr({
  scope: "col"
})
$th4.text("Next Arrival")

$th5 = $('<th>')
$th5.attr({
  scope: "col"
})
$th5.text("Minutes Away")


$topRow.append($th1,$th2,$th3,$th4,$th5)
$thead.append($topRow)
$trainTable.append($thead)
$('#train-table').append($trainTable)



$tableBody = $('<tbody>')
$($trainTable).append($tableBody)







// form field
// Train input field
$formTitle = $('<div>')
$formTitle.html("<h4>Add A Train</h4>")
$formTitle.addClass("bg-primary text-light container pt-1 pb-1")
$('#input-form').prepend($formTitle)

$form = $('<form card>')
$form.addClass("container border border-primary")
$formdiv1 = $('<div>')
$formdiv1.addClass("form-group")

$label1 = $('<label>')
$label1.text('Train Name')
$label1.attr({
  class: "p-1",
  for: "formGroupInput1"
})
$input1 = $('<input>')
$input1.attr({
  type: "text",
  class: "form-control",
  id: "formGroupInput1",
  placeholder: "E.g. Richmond Train"
})
$('#input-form').append($form.append($formdiv1.append($label1).append($input1)))

// Destination input field
$formdiv2 = $('<div>')
$formdiv2.addClass("form-group")
$label2 = $('<label>')
$label2.text('Destination')
$label2.attr({
  for: "formGroupInput2"
})
$input2 = $('<input>')
$input2.attr({
  type: "text",
  class: "form-control",
  id: "formGroupInput2",
  placeholder: "E.g. Richmond"
})
$('#input-form').append($form.append($formdiv2.append($label2).append($input2)))

// First Train time (military time) input field
$formdiv3 = $('<div>')
$formdiv3.addClass("form-group")
$label3 = $('<label>')
$label3.text('First Train Time')
$label3.attr({
  for: "formGroupInput3"
})
$input3 = $('<input>')
$input3.attr({
  type: "time",
  class: "form-control",
  id: "formGroupInput3",
  placeholder: '05:00'
})
$('#input-form').append($form.append($formdiv3.append($label3).append($input3)))


// Frequency in minutes input field
$formdiv4 = $('<div>')
$formdiv4.addClass("form-group")
$label4 = $('<label>')
$label4.text('Frequency (min)')
$label4.attr({
  for: "formGroupInput4"
})
$input4 = $('<input>')
$input4.attr({
  type: "number",
  class: "form-control",
  id: "formGroupInput4",
  placeholder: "E.g. 25"
})
$('#input-form').append($form.append($formdiv4.append($label4).append($input4)))

// submit button 
$submitButton = $('<button>')
$submitButton.attr({
  type: "submit",
  class: "btn btn-primary",
  id: "submit"
})
$submitButton.text("Submit")
$($form).append($submitButton)







  // Functions
  // ================================================================================

  // On Click
  $("#submit").on("click", function(event) {
    event.preventDefault();

    var trainName = $('#formGroupInput1').val().trim();
    var destination = $('#formGroupInput2').val().trim();
    var firstTrain = $('#formGroupInput3').val().trim();
    var freq = ($('#formGroupInput4').val());

    var newTrain = {
      name: trainName,
      destination: destination,
      freq: freq,
      firstTrain: firstTrain
    }

    database.ref().push(newTrain)

    $('#formGroupInput1').val("")
    $('#formGroupInput2').val("")
    $('#formGroupInput3').val("")
    $('#formGroupInput4').val("")
  });

database.ref().on("child_added", function(childSnapshot) {
  
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var freq = childSnapshot.val().freq;
    var firstTrain = childSnapshot.val().firstTrain;
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes")
    var tRemainder = diffTime % freq
    var minutesAway = freq - tRemainder;
    var nextArrival = currentTime.add(minutesAway, "minutes")



    // var nextArrivalPretty = moment(nextArrival).format('HH:mm')
    var $newRow = $('<tr>')
        $newtd1 = $('<td>')
        $newtd1.attr({
          scope: 'row'
        })
        $newtd1.append(
          $('<td>').text(trainName),
        )
        $newRow.append($newtd1)

        $newtd2 = $('<td>')
        $newtd2.attr({
          scope: 'row'
        })
        $newtd2.append(
          $('<td>').text(destination)
        )
        $newRow.append($newtd2)


        $newtd3 = $('<td>')
        $newtd3.attr({
          scope: 'row'
        })
        $newtd3.append(
          $('<td>').text(freq)
        )
        $newRow.append($newtd3)
        
        $newtd4 = $('<td>')
        $newtd4.attr({
          scope: 'row'
        })
        $newtd4.append(
          $('<td>').html(moment(nextArrival).format("HH:mm")))
        
        $newRow.append($newtd4)
        
        
        $newtd5 = $('<td>')
        $newtd5.attr({
          scope: 'row'
        })
        $newtd5.append(
          $('<td>').text(minutesAway))
        
        $newRow.append($newtd5)
    $tableBody.append($newRow);
});