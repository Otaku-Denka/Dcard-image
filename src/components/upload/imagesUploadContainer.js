import * as React from 'react';
import styled from 'styled-components';
import { Tabs, Tab, FormControl, Button } from 'react-bootstrap';
import Cropper from 'react-cropper';
import AddMosaicCanvas from '../addMosaicCanvas';
import ImageCompressor from 'image-compressor.js';
export default class ImagesUploadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabKey: 1,
            originPreview: '',
            originfile: '',
            cropped: false,
            croppedImg: '',
            croppedImgWidth: 0,
            croppedImgHeight: 0,
            toggle: false
        };
    }
    handleTabSelect(key) {
        this.setState({
            activeTabKey: key
        });
    }
    handleKeyDown(e) {
        if (e.keyCode === 13) {
            if (e.target.value !== '') {
                this.setState({
                    originPreview: e.target.value,
                    cropped: true,
                    croppedImg: ''
                });
            }
        }
    }
    handleUploadChange(e) {
        const file = e.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        const that = this;
        if (file) {
            if (allowedExtensions.exec(file.name)) {
                new ImageCompressor(file, {
                    maxWidth: 1024,
                    maxHeight: 768,
                    success(result) {
                        var reader = new FileReader();
                        reader.readAsDataURL(result);
                        reader.onload = event => {
                            that.setState({
                                originPreview: reader.result,
                                originfile: result,
                                cropped: true
                            });
                        };
                    },
                    error(e) {
                        console.log(e.message);
                    }
                });
            } else {
                alert('僅支援JPG、JEPG、PNG格式圖片');
            }
        }
    }
    _crop() {
        this.setState({
            croppedImg: this.cropper.getCroppedCanvas().toDataURL(),
            cropped: false,
            croppedImgWidth: this.cropper.getData().width,
            croppedImgHeight: this.cropper.getData().height
        });
    }
    render() {
        let imagesJson = window.localStorage.getItem('imagesJson') || null;
        let imagesData = imagesJson ? JSON.parse(imagesJson) : [];
        const renderImgs = imagesData.map(item => {
            return (
                <div key={item.name}>
                    <a
                        style={{ cursor: 'pointer' }}
                        onClick={e => {
                            const image = new Image();
                            image.src = item.src;
                            const w = window.open('');
                            w.document.write(image.outerHTML);
                        }}
                    >
                        {' '}
                        {item.name}
                    </a>
                </div>
            );
        });

        return (
            <Layout>
                <UploadWrap>
                    <Tabs
                        defaultActiveKey={this.state.activeTabKey}
                        onSelect={key => {
                            this.handleTabSelect(key);
                            if (key === 3) {
                                this.setState({
                                    croppedImg: ''
                                });
                            }
                        }}
                        id="controlled-tab"
                        animation={false}
                    >
                        <Tab eventKey={1} title="上傳圖片">
                            <UploadBtn
                                type="file"
                                onClick={() => {
                                    this.setState({
                                        cropped: true,
                                        croppedImg: ''
                                    });
                                }}
                                onChange={e => {
                                    this.handleUploadChange(e);
                                }}
                            />
                        </Tab>

                        <Tab eventKey={2} title="圖片網址">
                            <FormControl
                                type="text"
                                placeholder="圖片網址"
                                style={{ marginTop: '20px' }}
                                onKeyDown={e => {
                                    this.handleKeyDown(e);
                                }}
                            />
                        </Tab>
                        <Tab eventKey={3} title="圖片列表">
                            <div>
                                <Button
                                    onClick={() => {
                                        localStorage.removeItem(
                                            'imagesJson',
                                            null
                                        );
                                        this.setState({
                                            toggle: !this.state.toggle
                                        });
                                    }}
                                >
                                    清除所有圖片
                                </Button>
                            </div>
                            {renderImgs}
                        </Tab>
                    </Tabs>
                    {this.state.cropped ? (
                        <div>
                            <CropperBtnContainer>
                                <Button
                                    bsStyle="primary"
                                    onClick={() => {
                                        this._crop();
                                    }}
                                >
                                    確定剪裁
                                </Button>
                            </CropperBtnContainer>
                            <CropperContainer>
                                <Cropper
                                    src={this.state.originPreview}
                                    ref={node => {
                                        this.cropper = node;
                                    }}
                                    style={{
                                        width: '100%',
                                        maxHeight: '800px'
                                    }}
                                />
                            </CropperContainer>
                        </div>
                    ) : (
                        ''
                    )}

                    <ImgContainer>
                        <AddMosaicCanvas
                            src={this.state.croppedImg}
                            width={this.state.croppedImgWidth}
                            height={this.state.croppedImgHeight}
                            cropped={this.state.cropped}
                        />
                    </ImgContainer>
                </UploadWrap>
            </Layout>
        );
    }
}

const Layout = styled.div`
    background: #eceff1;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

const UploadWrap = styled.div`
    margin: 20px auto;
    width: 80%;
    min-width: 800px;
    border-radius: 10px;
    background: #fff;
    padding: 20px;
`;

const UploadBtn = styled.input`
    margin-top: 20px;
`;

// const PreviewImg = styled.div`
//     width: 100%;
//     display: block;
//     margin-top: 20px;
// `;

const CropperContainer = styled.div`
    width: 100%;
    margin-top: 20px;
`;

const CropperBtnContainer = styled.div`
    padding: 10px 0;
    margin-top: 20px;
`;

const ImgContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;
