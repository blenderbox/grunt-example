## Setup

1. First, you need to have `node` and `npm` installed. For instructions
on how to do that, look at node's installation [instruction wiki on
github](https://github.com/joyent/node/wiki/Installation). If you scroll
down, there's instructions on installing a package, rather than building
the source.

2. Install `grunt` and uninstall any existing installation you may have,
since this requires version 0.4.0:
```bash
$ sudo npm uninstall -g grunt
$ sudo npm install -g grunt-cli
```

3. Checkout this repo, enter into the directory, and install the NPM packages:
```bash
$ git checkout https://github.com/blenderbox/grunt-example.git
$ cd grunt-example
$ npm install
```


Now, you'll have installed all of the necessary npm packages locally, as
to not pollute your other node environments, and we can start working on
the front-end of our project.


---


## Running

Play around with the `grunt-cli` to find all of the useful commands
(`--help`).

```bash
$ grunt server
```

```bash
$ grunt
```
