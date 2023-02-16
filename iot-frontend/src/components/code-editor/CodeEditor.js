import React, {Fragment} from 'react'

import Editor from 'react-simple-code-editor'
import Highlight, {defaultProps} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import styled from "styled-components"

const styles = {
    root: {
        boxSizing: 'border-box',
        // fontFamily: '"Dank Mono", "Fira Code", monospace',
        ...theme.plain
    }
}

const Pre = styled.pre`
  text-align: left;
  overflow: scroll;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;

const CodeEditor = (props) => {
    const {script, setScript} = props

    const onValueChange = script => {
        setScript(script)
    }

    const highlight = script => (
        <Highlight {...defaultProps} theme={theme} code={script} language="javascript">
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <Fragment>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({line, key: i})}>
                            {line.map((token, key) => <span {...getTokenProps({token, key})} />)}
                        </div>
                    ))}
                </Fragment>
            )}
        </Highlight>
    )


    return (
        <Editor
            value={script}
            onValueChange={onValueChange}
            highlight={highlight}
            padding={10}
            style={styles.root}
            autoFocus={true}
        />
    )
}
export default CodeEditor
