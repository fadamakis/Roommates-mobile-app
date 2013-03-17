var baseurl;
var loginok;
// baseurl = "http://localhost/w/roommates";
baseurl = "https://roommates.teiath.gr";
//baseurl = "http://roommates.edu.teiath.gr";



function login() {
    username = $("#username").val();
    password = $("#password").val();
    if(loginok){
        $.mobile.changePage("#index");
    }
    if (username && password) {
        localStorage.username = username;
        localStorage.password = password;
        $("#logmsg").html(" <h5>Γίνεται αυθεντικοποίηση...</h5>");
        $.mobile.showPageLoadingMsg();

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
                    loginok = true;
                    var items = [];
                    $.each(data, function (key, val) {
                    	if (val.student) {
                    	if(val.student.email == localStorage.username +"@teiath.gr"){
                    		localStorage.uid = val.student.id;
                    	}
                            items.push(($("#userstemplate").render(val)));
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
                },
                complete:function(){
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
								if(val.house.user_id == localStorage.uid){
									localStorage.hid = val.house.id;	
								}
                                items.push(($("#housestemplate").render(val)));
                            });
                            $("#list-houses").html(items.join(''));

                        }
                    });
                }
            });

    }


}

function gethouse(hid) {
    $.mobile.showPageLoadingMsg();
    $.ajax
        ({
            type:"GET",
            url:baseurl + "/webservice/house/" + hid,
            beforeSend:function (xhr) {
                xhr.setRequestHeader('accept', 'application/json');
            },
            success:function (data) {
                // console.log(data);
                $("#renderHouse").html($("#housetemplate").render(data));
                $.mobile.hidePageLoadingMsg();
                $.mobile.changePage("#home");
                $("#renderHouse").find(":jqmData(role=listview)").listview();


            }
        });
}


function getuser(uid) {
    $.mobile.showPageLoadingMsg();
    $.ajax
        ({
            type:"GET",
            url:baseurl + "/webservice/user/" + uid,
            beforeSend:function (xhr) {
                var creds = localStorage.username + ":" + localStorage.password;
                var basicScheme = btoa(creds);
                var hashStr = "Basic " + basicScheme;
                xhr.setRequestHeader('Authorization', hashStr);
                xhr.setRequestHeader('accept', 'application/json');
            },
            success:function (data) {
              // console.log(data);
                $("#renderUser").html($("#usertemplate").render(data));
                $.mobile.hidePageLoadingMsg();
                $.mobile.changePage("#student");
                $("#renderUser").find(":jqmData(role=listview)").listview();
            }
        });
}


function logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    $.mobile.changePage("#index");
    
}

