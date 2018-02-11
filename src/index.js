import 'bootstrap/dist/css/bootstrap.css';
import 'cropperjs/dist/cropper.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import ImagesUploadContainer from './components/upload/imagesUploadContainer';

ReactDOM.render(<ImagesUploadContainer />, document.getElementById('root'));
registerServiceWorker();
