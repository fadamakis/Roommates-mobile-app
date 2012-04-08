var baseurl = "";
var nextpage = "#index";
localStorage.userid = 6;


$(document).bind("mobileinit", function () {
    $.mobile.page.prototype.options.addBackBtn = true;
});


function saveLogin() {
    username = $("#username").val();
    password = $("#password").val();
    if (username) {
        localStorage.phonegapName = username;
        if (password) {
            localStorage.phonegapPass = password;
            $("#logmsg").html(
                " Γίνεται αυθεντικοποίηση...");
            if (password == "123") {
                $.mobile.changePage("#index");
            } else {
                $("#logmsg").html("Λάθος Συνθηματικό!");

            }
        }
    }
}


function gethouses() {
    var items = [];
    $.getJSON('http://localhost/w/ajax/houses.json', function (data) {
        var items = [];
        console.log(data);
        $.each(data, function (key, val) {
            items.push('<li><a  href="#" data-transition="slide" onclick="gethouse(' + val.House.id + ');" >' + val.House.address + '</a></li>');
        });
        $("#list-houses").html(items.join(''));
        $("#list-houses").listview("refresh");
    });
    $.mobile.changePage("#houseslist");
}

function getusers() {
    $.getJSON('http://localhost/w/ajax/users.json', function (data) {
        var items = [];
        $.each(data, function (key, val) {
            if (val.student) {
                items.push('<li><a  href="#" data-transition="slide" onclick="getuser(' + val.student.id + ');" >' + val.student.firstname + ' ' + val.student.lastname + '</a></li>');
            }
        });
        $("#list-users").html(items.join(''));
        $("#list-users").listview("refresh");

    });
    $.mobile.changePage("#userslist");
}


function gethouse(hid) {

    $.getJSON('http://localhost/w/ajax/house5.json', function (data) {
        console.log(data);
        $.each(data, function (key, val) {
            if (val) {
                $("#address").html('Οδός ' + val.House.address);
                $("#dimos").html('Δήμος ' + val.Municipality.name);
                $("#type").html(val.HouseType.type);
                $("#area").html(val.House.area + 'τ.μ.');
                $("#price").html(val.House.price + '€');


                $("#bedrooms").html(val.House.bedroom_num);
                $("#bathrooms").html(val.House.bathroom_num);
                $("#floor").html(val.Floor.type);
                $("#year").html(val.House.created);
                $("#heating").html(val.HeatingType.type);
                $("#living").html(val.House.currently_hosting);
                $("#availability").html(val.House.free_places);
                $("#distance").html(val.House.geo_distance);

                $("#parking").html((val.House.parking == 0) ? 'Όχι' : 'Ναι');
                $("#solar").html((val.House.solar_heater == 0) ? 'Όχι' : 'Ναι');
                $("#furniture").html((val.House.furnitured == 0) ? 'Όχι' : 'Ναι');
                $("#clima").html((val.House.aircondition == 0) ? 'Όχι' : 'Ναι');
                $("#garden").html((val.House.garden == 0) ? 'Όχι' : 'Ναι');
                $("#shared-pay").html((val.House.shared_pay == 0) ? 'Όχι' : 'Ναι');
                $("#doors").html((val.House.security_doors == 0) ? 'Όχι' : 'Ναι');
                $("#amea").html((val.House.disability_facilities == 0) ? 'Όχι' : 'Ναι');


            }
        });
    });
    $.mobile.changePage("#home");


}


function getuser2(uid) {

    $.getJSON('http://localhost/w/ajax/user62.json', function (data) {
        console.log(data);
        $.each(data, function (key, val) {
            if (val) {

                $("#weare").html(val.we_are);
                $("#looking").html(val.max_roommates);


            }
        });

    });

    $.mobile.changePage("#student");


}


function getuser(uid) {
    $.getJSON('http://localhost/w/ajax/user6.json', function (data) {

        var items = [];
        $.each(data, function (key, val) {
            $("#fullname").html(val.firstname + ' ' + val.lastname);

            if (val.gender) {items.push('<li class="ui-li ui-li-static ui-body-c">' + getgender(val.gender));}
            if (val.dob)    {items.push('<li class="ui-li ui-li-static ui-body-c">' + getage(val.dob));}
            if (val.email)  {items.push('<li class="ui-li ui-li-static ui-body-c"><a href="mailto:' + val.email +'"></a>');}
            if (val.phone)  {items.push('<li class="ui-li ui-li-static ui-body-c"><a href="tel:' + val.phone +'"></a>');}
        });
        $("#user-1").html(items.join(''));
        $("#user-1").listview("refresh");

    });
    $.mobile.changePage("#student");
}



function getgender(g) {
    if (g == "male") {
        return 'Άνδρας';
    }
    return 'Γυναίκα';
}
function getage(a) {
    var date = new Date();
    return date.getFullYear() - a;
}
