# codbex-bids
Bids Management Application

### Model

![model](images/bids-model.png)

### Application

#### Launchpad

![launchpad](images/bids-launchpad.png)

#### Launchpad

![offers](images/bids-offers.png)

![bids](images/bids-bids.png)


### Infrastructure

#### Build

	docker build -t codbex-bids:1.0.0 .

#### Run

	docker run --name codbex-bids -d -p 8080:8080 codbex-bids:1.0.0

#### Clean

	docker rm codbex-bids