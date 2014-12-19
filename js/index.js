var app = {
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        //app.onDeviceReady();
    },
    onDeviceReady: function() {
        if(device.platform == 'android' || device.platform == 'Android') {
            navigator.contactsPhoneNumbers.list(function(contacts) {
                //console.log(contacts.length + ' contacts found');
                //$('#content').append(contacts.length + ' contacts found.<br/>');
                for(var i = 0; i < contacts.length; i++) {
                    var concatContact = "<li><div class='row outercard'><div class='col-xs-3 left-column'><img src='content://com.android.contacts/contacts/"+contacts[i].id+"/photo' onerror='app.imgError(this)' width='64px' height='64px'/></div><div class='col-xs-9 right-column'><ul class='list-group'><li class='list-group-item'><b><span class='name'>"+contacts[i].displayName+"</span></b></li>";
                    //console.log(contacts[i].id + " - " + contacts[i].displayName);
                    //$('#content').append(contacts[i].id + " - " + contacts[i].displayName + '<br/>');
                    for(var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                        var phone = contacts[i].phoneNumbers[j];
                        //console.log("===> " + phone.type + "  " + phone.number + " (" + phone.normalizedNumber+ ")");
                        concatContact += "<li class='list-group-item'><b>"+phone.type+" :</b><br/><span class='phone'>"+phone.normalizedNumber+"</span><input type='checkbox' name='my_number' value='"+phone.normalizedNumber+"' class='pull-right'/></li>";
                        //$('#content').append("===> " + phone.type + "  " + phone.number + " (" + phone.normalizedNumber+ ")<br/>");
                    }
                    concatContact += "</ul></div></div></li>";
                    $('#contactList').append(concatContact);
                    concatContact = "";
                }
                var options = {
                    valueNames: [ 'name', 'phone' ],
                    indexAsync: true
                };
                var contactList = new List('content', options);
                contactList.sort(['name'],{order:"asc"});
            }, function(error) {
                //console.error(error);
                $('#content').empty();
                $('#content').append(error);
            });
        } else {
            app.getOtherOSContact();
        }
    },
    imgError: function(source) {
        source.src = "img/customer.png";
    },
    getSelectedContacts: function() {
        var selectedContacts = "";
        $('#content :checked').each(function() {
            selectedContacts += this.value+"&#";
        });
        alert(selectedContacts);
    },
    getOtherOSContact: function() {
        // find all contacts in any name field
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.fieldType.phoneNumbers];
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.fieldType.phoneNumbers];
        //options.desiredFields = [navigator.contacts.fieldType.id];
        //var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, app.onContactSuccess, app.onContactError, options);
        },
    onContactSuccess: function(contacts) {
        $('#content').append(JSON.stringify(contacts));
        $('#content').append('<br/><br/>');
        for (var i = 0; i < contacts.length; i++) {
            $('#content').append(JSON.stringify(contacts[i]));
        }
        $('#content').append('<br/><br/>');
        $('#content').append('Found ' + contacts.length + ' contacts.');
        //alert('Found ' + contacts.length + ' contacts.');
    },
    onContactError: function(contactError) {
        //alert('onError!');
        $('#content').append(contactError);
    }
};

app.initialize();

$('#call_init').click( function() {
    app.getSelectedContacts();
});

$('.search').on('focus', function () {
   $('footer').hide();
});

$('.search').on('blur', function(){
    setTimeout(function() {
        $('footer').show();
    }, 500);
});