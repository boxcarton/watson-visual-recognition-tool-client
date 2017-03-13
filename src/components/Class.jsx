import React from 'react'
import Radium from 'radium'
import { Tooltip } from 'reactstrap'

import Styles from './Styles'
import DropButton from './DropButton'
import TitleCard from './TitleCard'

@Radium
export default class Class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipOpen: false
        }
    }

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    stateChanged = () => {
        this.setState({
            tooltipOpen: false
        })
        this.props.reDraw()
    }

    onDrop = (file, rejects) => {
        this.setState({ error: null }, this.stateChanged)
        this.props.setClassFile(file, this.props.id)
        if (file == null || file.length <= 0) {
            if (rejects != null && rejects[0].size > 100 * 1024 * 1024 && (rejects[0].type == 'application/zip')) {
                this.setState({ error: 'Size limit (100MB) exceeded' }, this.stateChanged)
                return
            }
            if (rejects != null) {
                this.setState({ error: 'Invalid file (must be .zip)' }, this.stateChanged)
                return
            }
        }
    }

    onTextChange = (text) => {
        this.props.setClassName(text, this.props.id)
    }

    delete = () => {
        this.props.delete(this.props.id)
    }

    render() {
        var textStyles = {
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontDefault,
                fontWeight: 'bold',
            }
        }

        var extraPadding = {
            padding: '44px 0px'
        }

        var error = {
            paddingBottom: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var deleteStyle = {
            backgroundColor: 'transparent',
            backgroundImage: `url(${'/btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundPosition: '0 0',
            backgroundSize: '75px 25px',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            ':hover': {
                backgroundPosition: '-25px 0',
            },
            ':active': {
                backgroundPosition: '-50px 0',
            }
        }

        return (
            <div className="grid-item">
                <div style={this.props.style}>
                    <TitleCard
                        id={this.props.negative ? 'neg' : null}
                        errors={this.props.errors}
                        title={this.props.title}
                        negative={this.props.negative}
                        fixedTitle={this.props.fixedTitle}
                        inputStyle={textStyles.header}
                        placeholder='Class name'
                        onChange={this.onTextChange}>
                        {this.props.negative || this.props.fixedTitle ? null :
                            <div style={{position: 'relative', width: '100%', minWidth: '100%'}}>
                                <div style={{position: 'absolute', top: '-43px', right: '0'}}>
                                    <button className="delete-class" key={this.props.id} style={deleteStyle}
                                        onClick={this.delete}>
                                    </button>
                                </div>
                            </div>
                        }
                        {this.state.error ? <div id='error--create-classifier' style={error}>{this.state.error}</div> : null}
                        <DropButton
                            accept={'application/zip, application/x-zip-compressed, multipart/x-zip, application/x-compressed'}
                            maxSize={100 * 1024 * 1024}
                            style={extraPadding}
                            errors={this.props.negative ? false : this.props.errors}
                            text='Drag .zip here to train class'
                            subtext='choose your file'
                            onDrop={this.onDrop}
                            clear={true}/>
                        {this.props.negative ?
                            <Tooltip placement='top' isOpen={this.state.tooltipOpen} delay={{show: 200, hide: 100}} autohide={false} target='neg' toggle={this.toggle}>
                                <div style={{textAlign: 'left'}}>Negative examples define what the classifier is not. They should be images that are visually similar to the positive examples, but do not depict any class.</div>
                            </Tooltip> :
                        null}
                    </TitleCard>
                </div>
            </div>
        )
    }
}
