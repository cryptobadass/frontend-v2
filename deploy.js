const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { NodeSSH } = require('node-ssh');

const distPath = path.resolve(__dirname, 'dist');

const ssh = new NodeSSH();

const config_all = {
  qa: {
    host: 'ec2-44-200-25-74.compute-1.amazonaws.com',
    pathUrl: '/var/www/',
    webName: 'yotei.qa',
    useName: 'ec2-user'
  },
  prd: {
    host: 'ec2-44-200-25-74.compute-1.amazonaws.com',
    pathUrl: '/var/www/',
    webName: 'yotei.qa',
    useName: 'ec2-user'
  }
};

const config = config_all[process.env.NODE_ENV === 'production' ? 'prd' : 'qa'];

const zipDirector = () => {
  const output = fs.createWriteStream(`${__dirname}/dist.zip`);
  const archive = archiver('zip', {
    zlib: { level: 3 }
  }).on('error', err => {
    throw err;
  });
  output.on('close', err => {
    if (err) {
      console.log('something error width the zip process:', err);
      return;
    }
    uploadFile();
    console.log(`${archive.pointer()} total bytes`);
    console.log(
      'archiver has been finalized and the output file descriptor has closed.'
    );
  });
  output.on('end', () => {
    console.log('Data has been drained');
  });
  archive.pipe(output);
  archive.directory(distPath, '/');
  archive.finalize();
};

function uploadFile() {
  ssh
    .connect({
      host: config.host,
      username: config.useName,
      privateKey: `${process.env.HOME}/.ssh/id_rsa` // set you key path
    })
    .then(() => {
      console.log('SSH login success');
      // remoteServiceUpdate()
      ssh
        .putFile(
          path.resolve(__dirname, 'dist.zip'),
          `${config.pathUrl}/dist.zip`
        )
        .then(() => {
          console.log('The zip file is upload successful');
          remoteServiceUpdate();
        })
        .catch(err => {
          console.log('the file upload fail:', err);
          process.exit(0);
        });
    })
    .catch(err => {
      console.log('SSH conneting fail:', err);
      process.exit(0);
    });
}

const remoteServiceUpdate = () => {
  ssh
    .execCommand(`unzip -o dist.zip -d ./${config.webName} `, {
      cwd: config.pathUrl
    })
    .then(result => {
      console.log(`The update message is: ${result.stdout}`);
      if (!result.stderr) {
        console.log('Gratefule! update success!');
        process.exit(0);
      } else {
        console.log('Something wrong:', result);
        process.exit(0);
      }
    });
};

zipDirector();
