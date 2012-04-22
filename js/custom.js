var baseurl = "http://localhost/w/roommates";
//var baseurl = "https://roommates.teiath.gr";

localStorage.userid = 6;

function saveusers(data) {
    var viewData = new Lawnchair({name:'users'}, function (viewData) {

        viewData.save({key:'data', options:data}, function (obj) {
            console.log(obj)
        });

        viewData.get('data', function (data) {
            console.log(data.options);
        });


    });
}


function login() {
    username = $("#username").val();
    password = $("#password").val();
    if (username && password) {
        $("#logmsg").html(" <h5>Γίνεται αυθεντικοποίηση...</h5>");
        $.mobile.showPageLoadingMsg();
        $.ajax
            ({
                type:"GET",
                url:baseurl + "/webservice/houses",
                beforeSend:function (xhr) {
                    xhr.setRequestHeader('accept', 'application/json');
                },
                success:function (data) {
                    var items = [];
                    $.each(data, function (key, val) {
                        items.push('<li><a  href="#" data-transition="slide" onclick="gethouse(' + val.House.id + ');" >' + val.House.address + '</a></li>');
                    });
                    $("#list-houses").html(items.join(''));

                }
            });
        $.ajax
            ({
                type:"GET",
                url:baseurl + "/webservice/users",
                beforeSend:function (xhr) {
                    var creds = username + ":" + password;
                    var basicScheme = btoa(creds);
                    var hashStr = "Basic " + basicScheme;
                    xhr.setRequestHeader('Authorization', hashStr);
                    xhr.setRequestHeader('accept', 'application/json');
                },
                success:function (data) {
                    var items = [];
                    $.each(data, function (key, val) {
                        if (val.student) {
                            items.push('<li><a  href="#" data-transition="slide" onclick="getuser(' + val.student.id + ');" >' + val.student.firstname + ' ' + val.student.lastname + '</a></li>');
                        }
                    });
                    $(".listusers").html(items.join(''));
                    $.mobile.hidePageLoadingMsg();
                    if (data.http_response_code == "403") {
                        $("#logmsg").html(" <h5>Ελέγξτε τα στοιχεία σας και προσπαθήστε ξανά...</h5>");
                    }
                    else {
                        $.mobile.changePage("#index");

                    }
                }
            });

    }


}

function gethouse(hid) {

    $.getJSON('http://localhost/w/ajax/house5.json', function (data) {
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

function getuser(uid) {
    var items = [];

    $.ajax
        ({
            type:"GET",
            url:'http://localhost/w/roommates/webservice/user/' + uid,
            dataType:'json',
            beforeSend:function (xhr) {
                var creds = localStorage.username + ":" + localStorage.password;
                var basicScheme = btoa(creds);
                var hashStr = "Basic " + basicScheme;
                xhr.setRequestHeader('Authorization', hashStr);
                xhr.setRequestHeader('accept', 'application/json');
            },
            success:function (data) {
                console.log(data);

                $.each(data, function (key, val) {
                    console.log(data);
                    $("#fullname").html(val.firstname + ' ' + val.lastname);

                    if (val.gender) {
                        items.push('<li class="ui-li ui-li-static ui-body-c">' + getgender(val.gender));
                    }
                    if (val.dob) {
                        items.push('<li class="ui-li ui-li-static ui-body-c">' + getage(val.dob));
                    }
                    if (val.email) {
                        items.push('<li class="ui-li ui-li-static ui-body-c"><a href="mailto:' + val.email + '">' + val.email + '</a>');
                    }
                    if (val.phone) {
                        items.push('<li class="ui-li ui-li-static ui-body-c"><a href="tel:' + val.phone + '">' + val.phone + '</a>');
                    }
                });


                $("#user-1").html(items.join(''));
                $("#user-1").listview("refresh");
            }
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

function posthouse() {
    $.ajax
        ({
            type:"POST",
            url:"http://localhost/w/roommates/webservice/house/1",
            dataType:'json',
            beforeSend:function (xhr) {
                var creds = "user1:roommates";
                var basicScheme = btoa(creds);
                var hashStr = "Basic " + basicScheme;
                xhr.setRequestHeader('Authorization', hashStr);
                xhr.setRequestHeader('accept', 'application/json');
            },
            success:function (message) {
                alert("ok");
            },
            data:{"House":{"id":"1", "address":"address 1", "postal_code":"11111", "area":"45", "bedroom_num":"3", "bathroom_num":"1", "price":"340", "construction_year":null, "solar_heater":"1", "furnitured":"1", "aircondition":"1", "garden":"0", "parking":"0", "shared_pay":"1", "security_doors":"0", "disability_facilities":"0", "storeroom":"0", "availability_date":"2011-11-05", "rent_period":null, "description":"This is the first house!", "created":"2012-04-11 19:28:00", "modified":"2012-04-11 19:28:00", "currently_hosting":"1", "total_places":"2", "user_id":"1", "visible":"1", "latitude":null, "longitude":null, "geo_distance":null, "free_places":"1"}, "Municipality":{"name":"\u0391\u03a3\u03a0\u03a1\u039f\u03a0\u03a5\u03a1\u0393\u039f\u03a5"}, "Floor":{"type":"\u00cf\u2026\u00cf\u20ac\u00ce\u00b5\u00cf\u0081\u00cf\u2026\u00cf\u02c6\u00cf\u2030\u00ce\u00bc\u00ce\u00ad\u00ce\u00bd"}, "HouseType":{"type":"\u00ce\u00b3\u00ce\u00ba\u00ce\u00b1\u00cf\u0081\u00cf\u0192\u00ce\u00bf\u00ce\u00bd\u00ce\u00b9\u00ce\u00ad\u00cf\u0081\u00ce\u00b1"}, "HeatingType":{"type":"\u00ce\u00b1\u00cf\u2026\u00cf\u201e\u00cf\u0152\u00ce\u00bd\u00ce\u00bf\u00ce\u00bc\u00ce\u00b7"}, "Image":null}
        });
}
