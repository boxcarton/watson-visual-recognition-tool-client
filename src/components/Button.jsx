import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class Button extends React.Component {
    static defaultProps = {
        kind: 'thin'
    }

    static propTypes = {
        kind: React.PropTypes.oneOf(['thin', 'bold'])
    }

    render() {
        var buttonStyle = {
            base: {
                lineHeight: '0px',
                alignSelf: 'center',
                cursor: 'pointer',
                borderRadius: '15px',
                borderColor: Styles.colorPrimary,
                borderWidth: 'thin',
                borderStyle: 'solid',
                height: '30px',
                font: Styles.fontDefault,
                padding: '0px 21px 0px 21px',
            },
            thin: {
                color: Styles.colorPrimary,
                background: 'rgba(0,0,0,0)',
                borderColor: Styles.colorPrimary,

                ':hover': {
                    color: 'white',
                    background: Styles.colorPrimary,
                    borderColor: Styles.colorPrimary,
                }
            },
            bold: {
                color: 'white',
                background: Styles.colorPrimary,
                borderColor: Styles.colorPrimary,

                ':hover': {
                    color: 'white',
                    background: Styles.colorDarkPrimary,
                    borderColor: Styles.colorDarkPrimary,
                }
            },
            image: {
                padding: '0px 4px 0px 21px',
            }
        }

        var imgStyle = {
            width: '21px',
            height: '21px',
            marginLeft: '21px',
            verticalAlign: 'middle',
        }

        var textStyle = {
            display: 'inline-block',
            verticalAlign: 'middle',
            color: 'inherit'
        }

        return (
            <button
                id={this.props.id}
                style = {
                    this.props.icon ? [buttonStyle.base, buttonStyle[this.props.kind], buttonStyle.image, this.props.style] : [buttonStyle.base, buttonStyle[this.props.kind], this.props.style]
                }
                data-dismiss={this.props.dataDismiss}
                onClick={this.props.onClick}>
                <div style={textStyle}>{this.props.text}</div>
                {this.props.icon ? <img src={this.props.icon} style={imgStyle}></img> : ''}
            </button>
        )
    }
}
