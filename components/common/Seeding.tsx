
import React, { useState } from 'react';
import WideAuthContainer from '../ordercloud-ui/WideAuthContainer';
import { Text } from '../vercel-ui';
 
  export interface SeedingViewProps {
    logs: string[];
    text: string;
  }
  
  const SeedingView = (props: SeedingViewProps) => {  
    var rows = props.logs.map(log => {
         return (
            <div style={{
                position: 'relative',
                display: 'flex',
                color: 'white',
                backgroundColor: 'transparent',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                marginTop: '-1px',
                marginBottom: '0',
                paddingLeft: '10px',
                boxSizing: 'border-box',
                }}>
                <div style={{
                    clear: 'right',
                    position: 'relative',
                    padding: '3px 22px 2px 0',
                    marginLeft: '15px',
                    minHeight: '18px',
                    flex: 'auto',
                    width: 'calc(100% - 15px)',
                }}>
                    <span>{log}</span>
                </div>
            </div>
        )
    })
    return (
      <WideAuthContainer>
         <Text variant="heading">{props.text}</Text>
         {/* <div style={{ backgroundColor: 'black' }}>
            <div style={{wordBreak: 'break-word', width: '100%'}}>
                {rows}
            </div>
         </div> */}
      </WideAuthContainer>
    );
  };
  
  export default SeedingView;
  