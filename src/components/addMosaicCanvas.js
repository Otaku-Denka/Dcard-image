import * as React from 'react';
import styled from 'styled-components';
import { FormControl, Button } from 'react-bootstrap';
import ImageCompressor from 'image-compressor.js';
import * as uuid from 'uuid/v1';

export default class AddMosaicCanvas extends React.Component {
    static defaultProps = {
        src: '',
        height: 0,
        width: 0
    };
    constructor(props) {
        super(props);
        this.state = {
            newImg: ``,
            width: 0,
            height: 0
        };
        this.canvas = '';
        this.downloadLink = '';
        this.draw = obj => {};
    }

    componentDidMount() {
        const canvas = this.canvas;

        var ctx = canvas.getContext('2d');

        var aImg = new Image();
        aImg.src = `${this.state.newImg}`;
        aImg.onload = function() {
            ctx.drawImage(this, 0, 0, this.props.width, this.props.height);
        };
    }
    handleWidthOnChange(e) {
        if (e.target.value >= 0 && e.target.value <= 1024) {
            this.setState({
                width: e.target.value
            });
        }
    }
    handleHeightOnChange(e) {
        if (e.target.value >= 0 && e.target.value <= 768) {
            this.setState({
                height: e.target.value
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.width !== this.props.width) {
            this.setState({
                width: this.props.width
            });
        }
        if (prevProps.height !== this.props.height) {
            this.setState({
                height: this.props.height
            });
        }
        if (prevProps.src !== this.props.src) {
            const canvas = this.canvas;
            const ctx = canvas.getContext('2d');

            this.setState(
                {
                    newImg: this.props.src
                },
                () => {
                    const aImg = new Image();
                    aImg.src = this.state.newImg;
                    aImg.onload = () => {
                        ctx.drawImage(
                            aImg,
                            0,
                            0,
                            this.props.width,
                            this.props.height
                        );
                    };
                }
            );
        }
    }

    render() {
        return (
            <div>
                {!this.props.cropped && this.state.newImg !== '' ? (
                    <div>
                        <BtnContainer>
                            <Button
                                bsStyle="success"
                                onClick={() => {
                                    let imagesJson =
                                        window.localStorage.getItem(
                                            'imagesJson'
                                        ) || null;

                                    const blobBin = atob(
                                        this.canvas.toDataURL().split(',')[1]
                                    );
                                    const that = this;
                                    let array = [];
                                    for (let i = 0; i < blobBin.length; i++) {
                                        array.push(blobBin.charCodeAt(i));
                                    }
                                    const file = new Blob(
                                        [new Uint8Array(array)],
                                        { type: 'image/png' }
                                    );

                                    new ImageCompressor(file, {
                                        width: this.state.width,
                                        height: this.state.width,
                                        success(result) {
                                            var reader = new FileReader();
                                            reader.readAsDataURL(result);
                                            reader.onload = event => {
                                                let imagesArray = imagesJson
                                                    ? JSON.parse(imagesJson)
                                                    : [];
                                                const data = {
                                                    src: reader.result,
                                                    name: uuid()
                                                };

                                                imagesArray.push(data);
                                                localStorage.setItem(
                                                    'imagesJson',
                                                    JSON.stringify(imagesArray)
                                                );
                                            };
                                        },
                                        error(e) {
                                            console.log(e.message);
                                        }
                                    });
                                }}
                            >
                                儲存
                            </Button>
                            <Btn>
                                <FormControl
                                    type="number"
                                    placeholder="設定寬度"
                                    max="1024"
                                    min="1"
                                    value={this.state.width}
                                    onChange={e => {
                                        this.handleWidthOnChange(e);
                                    }}
                                />
                            </Btn>
                            <Btn>
                                <FormControl
                                    type="number"
                                    placeholder="設定高度"
                                    max="768"
                                    min="1"
                                    value={this.state.height}
                                    onChange={e => {
                                        this.handleHeightOnChange(e);
                                    }}
                                />
                            </Btn>
                            <Button
                                bsStyle="primary"
                                onClick={() => {
                                    const blobBin = atob(
                                        this.canvas.toDataURL().split(',')[1]
                                    );
                                    const that = this;
                                    let array = [];
                                    for (let i = 0; i < blobBin.length; i++) {
                                        array.push(blobBin.charCodeAt(i));
                                    }
                                    const file = new Blob(
                                        [new Uint8Array(array)],
                                        { type: 'image/png' }
                                    );

                                    new ImageCompressor(file, {
                                        width: this.state.width,
                                        height: this.state.width,
                                        success(result) {
                                            var reader = new FileReader();
                                            reader.readAsDataURL(result);
                                            reader.onload = event => {
                                                that.downloadLink.href =
                                                    reader.result;
                                                that.downloadLink.download =
                                                    '下載.png';
                                                that.downloadLink.click();
                                            };
                                        },
                                        error(e) {
                                            console.log(e.message);
                                        }
                                    });
                                }}
                            >
                                下載
                            </Button>
                            <a
                                ref={node => {
                                    this.downloadLink = node;
                                }}
                            />
                        </BtnContainer>
                        <div style={{ textAlign: 'center' }}>
                            寬度最大為1024，高度最大為768
                        </div>
                    </div>
                ) : (
                    ''
                )}
                <canvas
                    width={
                        !this.props.cropped && this.state.newImg !== ''
                            ? this.props.width
                            : 0
                    }
                    height={
                        !this.props.cropped && this.state.newImg !== ''
                            ? this.props.height
                            : 0
                    }
                    ref={node => (this.canvas = node)}
                    onMouseMove={event => {
                        const canvas = event.target;
                        const ctx = canvas.getContext('2d');

                        const aImg = new Image();

                        aImg.src = this.state.newImg;

                        function getXY(obj, x, y) {
                            const w = obj.width;

                            let color = [];
                            color[0] = obj.data[4 * (y * w + x)];
                            color[1] = obj.data[4 * (y * w + x) + 1];
                            color[2] = obj.data[4 * (y * w + x) + 2];
                            color[3] = obj.data[4 * (y * w + x) + 3];

                            return color;
                        }

                        function setXY(obj, x, y, color) {
                            const w = obj.width;

                            obj.data[4 * (y * w + x)] = color[0];
                            obj.data[4 * (y * w + x) + 1] = color[1];
                            obj.data[4 * (y * w + x) + 2] = color[2];
                            obj.data[4 * (y * w + x) + 3] = color[3];
                        }
                        const draw = obj => {
                            ctx.drawImage(
                                obj,
                                0,
                                0,
                                this.props.width,
                                this.props.height
                            );

                            const oImg = ctx.getImageData(
                                event.pageX - ctx.canvas.offsetLeft - 25,
                                event.pageY - ctx.canvas.offsetTop - 25,
                                50,
                                50
                            );

                            const w = 200;
                            const h = 200;

                            const num = 10;

                            const stepW = w / num;
                            const stepH = h / num;

                            for (let i = 0; i < stepH; i++) {
                                for (let j = 0; j < stepW; j++) {
                                    let color = getXY(
                                        oImg,
                                        j * num +
                                            Math.floor(Math.random() * num),
                                        i * num +
                                            Math.floor(Math.random() * num)
                                    );

                                    for (let k = 0; k < num; k++) {
                                        for (let l = 0; l < num; l++) {
                                            setXY(
                                                oImg,
                                                j * num + l,
                                                i * num + k,
                                                color
                                            );
                                        }
                                    }
                                }
                            }

                            ctx.putImageData(
                                oImg,
                                event.pageX - ctx.canvas.offsetLeft - 25,
                                event.pageY - ctx.canvas.offsetTop - 25
                            );
                        };
                        draw(aImg);
                    }}
                    onClick={event => {
                        const canvas = event.target;

                        const src = canvas.toDataURL();
                        const aImg = new Image();

                        aImg.src = src;
                        this.setState({
                            newImg: src
                        });
                    }}
                    onMouseLeave={e => {
                        const canvas = e.target;
                        const ctx = canvas.getContext('2d');
                        const aImg = new Image();
                        aImg.src = this.state.newImg;
                        aImg.onload = () => {
                            ctx.drawImage(
                                aImg,
                                0,
                                0,
                                this.props.width,
                                this.props.height
                            );
                        };
                    }}
                />
            </div>
        );
    }
}

const BtnContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 10px;
    flex-wrap: wrap;
`;

const Btn = styled.div`
    display: inline-flex;
    width: 100px;
    margin: 0 10px;
`;
