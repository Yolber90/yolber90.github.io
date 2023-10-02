$(document).ready(function () {

    // API GET, subscription based api.
    $.get("https://fdo.rocketlaunch.live/json/launches?key=49d3c350-8af8-4606-ba6d-f67f4bcaca8f", function (data) {
        const launches = data['result']

        let providerOptions = []
        for (let i = 0; i < launches.length; i++) {
            providerOptions.push(launches[i]['provider']['name'])
        }

        // Creates a new set of all providers with duplicates removed
        var providerOptions2 = [...new Set(providerOptions)].sort();

        // Pickup unduplicated providers and append to options, create a drop down with all providers
        providerOptions2.map(OptPro => {
            $(".agency").append(
                "<option value ='" + OptPro + "''>" + OptPro + "</option>"
            );
        })

        // On Load, auto click the submit button, thsi will load 'All' launches.
        $(function(){
            $("#submit").click()
        })

        $("#submit").on("click", function (e) {
            
            
            let provider = []
            let vehicle = []
            let mission = []
            let locationCo = []
            let locationName = []
            let padName = []
            let description = []
            let time = []


            for (let i = 0; i < launches.length; i++) {

                function fillFields() {
                    provider.push(launches[i]['provider']['name'])
                    vehicle.push(launches[i]['vehicle']['name'])
                    mission.push(launches[i]['missions'][0]['name'])
                    locationCo.push(launches[i]['pad']['location']['country'])
                    locationName.push(launches[i]['pad']['location']['name'])
                    padName.push(launches[i]['pad']['name'])
                    description.push(launches[i]['launch_description'])
                    time.push(launches[i]['sort_date'])

                }
                function timeTranslator(tm) {
                    if (tm == null) {
                        return 'TBD';
                    } else {
                        return new Date(tm * 1000)
                    }
                }
                

                function tMinus(){
                    // Interval will re-run every second, updating the countdow time.
                    setInterval(function(){
                        
                        let total = new Date(time[0] * 1000) - new Date();
                        let seconds = Math.floor((total / 1000) % 60);
                        let minutes = Math.floor((total / 1000 / 60) % 60);
                        let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
                        let days =  Math.floor(total / (1000 * 60 * 60 * 24));


                        // load html with countdown, used terinary operator (arg? if true: if false) to return a 0 in fron of time if < 10
                        $("#t-minus").html(
                            days + " Days<br>" + 
                            (hours < 10 ? '0' + hours: hours) + "h:" + 
                            (minutes < 10? '0' + minutes: minutes) + "m:" + 
                            (seconds < 10 ? '0' + seconds: seconds) + "s"
                        )
                        


                    }, 1000)

                }
                
                
                
                
                tMinus(time[0])
                $("#vehicle").html(vehicle[0]);
                $("#provider").html(provider[0]);
                
                
                
                if ($(".agency").val() == 'All') {
                    fillFields()

                } else if (launches[i]['provider']['name'] == $(".agency").val()) {
                    fillFields()

                } else { }

                // On Submit, remove div results & childs, then re-append with new variables.
                

            }
            
            $(".results").remove();
            

            for (let i = 0; i < provider.length; i++) {
                
                $("#hits").html(provider.length);
                $("#next-launch").html(timeTranslator(time[0]));
                
                // $("#t-minus").html(new Date());


                $(".container-fluid").append(
                    "<div class='results shadow p-3 mb-5 bg-white rounded'>" +
                        "<div class='rocketImg'>" +
                        "<img  src='media/" + vehicle[i] + ".jpg' alt='" + vehicle[i] + "''>" + //Loads the image from media folder.
                    "</div>" +
                        "<div class='rocketDetails1'>" +
                            "<table cellpadding=5>" +
                                "<tr>" +
                                    "<th>Launch Provider</th>" +
                                    "<th>Vehicle</th>" +
                                    "<th>Mission</th>" +
                                    "<th>Country</th>" +
                                    "<th>Launch Site</th>" +
                                    "<th>Pad</th>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td>" + provider[i] + "</td>" +
                                    "<td>" + vehicle[i] + "</td>" +
                                    "<td>" + mission[i] + "</td>" +
                                    "<td>" + locationCo[i] + "</td>" +
                                    "<td>" + locationName[i] + "</td>" +
                                    "<td>" + padName[i] + "</td>" +
                                "</tr>" +
                            "</table>" +
                            "<hr>" +
                            "<table>" +
                                "<tr>" +
                                    "<th >Launch Date/Time</th>" +
                                    "<td>" + timeTranslator(time[i]) + "</td>" +
                                    "<th>T-minus</th>" +
                                    "<td id='tminus-td'></td>" + 
                                "</tr>" +
                            "</table>" +
                    
                    "<p style='margin-left: 10px' class='text-primary'>Mission Description:</p>" +
                    "<p style='margin-left: 10px'>" + description[i] + "</p>" +
                    "</div>"

                )
                $("th").addClass("text-primary")
                $("td").addClass("text-secondary")
            }
            e.preventDefault(); // Prevents page from reloading
            
        });

    })

});