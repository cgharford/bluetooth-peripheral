BLE Peripheral

Ryan Court and Christina Harford

We wrote our program using javascript and ran it with node.js, so we had no need
to create a Makefile. 

We started out by getting the 'Echo' program of the 'bleno' package working 
and using it as a launching pad. By looking at the online documentation, 
we added to the program and tweaked it until it met the program requirements. 

The most challenging part of this project was simply getting the characteristic 
value to change within the central program querying the services (the app on
my phone). Once we figured that out, the rest came easily enough, although 
sometimes figuring out small issues took a long time because there is very
little documentation and not very many examples online. 

Also, we initially tried using a shortcut to get the uptime and tried using 
the process.uptime() method. After talking to Jan and realizing that it was
not the correct method, we went back and changed the the program to call linux
shell commands from within the javascript. We had a bit of a challenge figuring
out how to deal with the asynchronous 'exec' calls until we discovered the 
handy 'execSync' provided by node. 

To run our program, we set up the environment in Kali exactly as the setup page 
of the lab instructed us to. Within the /playpen/node_modules folder, we had our 
program files and ran the following commands: 

	$ service bluetooth stop
	$ hciconfig hci0 up

We then ran our program with node using the command: 

	$ node BLEUptime

Our program created a peripheral called 'BLEUtime' and advertised itself. Every 
state change or event in the central is recorded in by the peripheral and 
outputted to the console (connects, disconnects, read requests, notify requests, 
changed values, etc.). 


