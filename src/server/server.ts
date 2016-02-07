import * as path from 'path';
import * as express from 'express';
import {OperationError, OperationSuccess} from '../common/operation-response';
import {AppQuery} from '../common/app-query';
import EfrontDownloader from 'efront-downloader/app/modules/app';

let app = express();
let root = path.join(path.resolve(__dirname, '../..'));

// Serve static files
app.use(express.static(path.join(root, 'dist/client')));

app.use('/static',express.static(path.join(root, 'static')));

function parseQuery(query : Object, def : Object){
  let toret = {};
  for(let k in def){
    if (def.hasOwnProperty(k)){
      if (query.hasOwnProperty(k)){
        if (typeof query[k] !== def[k]){
          if (def[k] === 'string' && typeof query[k] === 'number'){
            query[k] = query[k].toString();
          } else if (def[k] == 'number' && !isNaN(query[k])){
            query[k] = parseFloat(query[k]);
          } else {
            throw new Error('Invalid arguments');
          }
        }
        toret[k] = query[k];
      } else {
        throw new Error('Invalid arguments');
      }
    }
  }
  return toret;
}

app.get('/download', (req, res) => {
  let query : AppQuery;
  try {
    query = <AppQuery> parseQuery(req.query, {
      startUnit: 'number',
      endUnit: 'number',
      lesson: 'number',
      username: 'string',
      password: 'string',
      url: 'string'
    });
  } catch (e){
    return res.status(400).json(new OperationError(e.message));
  }

  let down = new EfrontDownloader(query.url, query.username, query.password,
    query.lesson, query.startUnit, query.endUnit, path.resolve(path.join(root, 'static')));
  down.run().then(p => {
    console.log('Finish');
    res.json({success:{
      data: path.relative(root, p),
      message: 'Successfully download'
    }});
  });
});

// Server
app.listen(3000, () => {
  console.log('Listen on http://localhost:3000');
});
