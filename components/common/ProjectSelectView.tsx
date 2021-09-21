import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, Button, Grid, MenuItem, Select } from '@material-ui/core';
import React, { FC, useState } from 'react'
import { NEW_PROJECT_CODE } from '../../services/constants';
import { VercelProject } from '../../types/VercelProject'
import { Button as VercelButton } from '../vercel-ui'
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { ConnectedProject, OrderCloudMarketplace } from './ViewCoordinator';
import { isNil } from 'lodash';


const ProjectSelectView: FC<{
  saveAndContinue: (selctions: ConnectedProject[]) => void,
  allProjects: VercelProject[],
  currentProjectId: string,
  savedConnections: ConnectedProject[],
}> = ({ saveAndContinue, allProjects, currentProjectId, savedConnections }) => {    
    var selectedProject = allProjects.find(p => p.id === currentProjectId);
    selectedProject = selectedProject || allProjects[0];       

    var newMarketplace = { ID: NEW_PROJECT_CODE, Name: "Seed new Marketplace", ApiClientID: null };
    var init = savedConnections.length > 0 ? [...savedConnections] : [{ project: selectedProject, ... newMarketplace}];
    const [connections, setConnections] = useState<ConnectedProject[]>(init);

    var allMarketplaces: OrderCloudMarketplace[] = savedConnections.reduce((marketplaces, project) => {
        if (!marketplaces.some(m => m.ID === project.ID)) {
            marketplaces.push({ ID: project.ID, Name: project.Name, ApiClientID: project.ApiClientID})
        }
        return marketplaces;
    }, [{ ID: NEW_PROJECT_CODE, Name: "Seed new Marketplace", ApiClientID: null }]);

    var unConnectedProjects = allProjects.filter(p => !connections.some(cp => cp.project.id === p.id));

    var disableProjectSelect = !isNil(currentProjectId) || allProjects.length < 2;
    var disableMarketplaceSelect = allMarketplaces.length < 2;
    var showAddProject = unConnectedProjects.length > 0 && isNil(currentProjectId);

    if (disableProjectSelect && disableMarketplaceSelect) {
        // skip project select step
        saveAndContinue(connections);
    }

    const addNewConnection = () => {
        setConnections(oldConnections => [...oldConnections, { project: unConnectedProjects[0], ... newMarketplace}]);
    }   

    const removeConnection = (index: number) => {
        setConnections(oldConnections => {
            oldConnections.splice(index, 1);
            return [...oldConnections];
        });
    }   

    const setConnectionProject = (index: number, projectID: string) => {
        var project = allProjects.find(x => x.id === projectID);
        setConnections(oldConnections => {
            var connection = oldConnections[index];
            connection.project = project;
            return [...oldConnections];
        });
    }  

    const setConnectionMarketplace = (index: number, marketplaceID: string) => {
        var marketplace = allMarketplaces.find(x => x.ID === marketplaceID);
        setConnections(oldConnections => {
            console.log(oldConnections);
            var connection = oldConnections[index];
            var newConection = {...marketplace, project: connection.project }
            oldConnections[index] = newConection;
            console.log([...oldConnections]);

            return [...oldConnections];
        });
    }  


    console.log("connections", connections);
    console.log("all marketplaces", allMarketplaces);

    return (
        <div className="flex justify-center min-h-screen overflow-visible font-sans antialiased bg-primary-100">
            <div className="py-6 w-full md:max-w-3xl md:mt-8">
                <img src='/oc_banner_logo.svg' style={{width: "200px", paddingBottom: "1rem"}} alt='OrderCloud'/>
                <div className="rounded border border-primary-200 bg-white">
                    <div style={{padding: "1.5rem"}}>
                        <h4 style={{fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600}}>Connection Details</h4>
                        <p style={{fontSize: "0.875rem", lineHeight: "1.25rem", marginTop: "0.75rem"}}>A new deployment is required for changes to take effect.</p>
                        <div style={{marginTop: "1.5rem"}}>
                        <Grid container>
                            <Grid container>
                                <Grid item xs>
                                    <div><b>Vercel Project</b></div>
                                </Grid>
                                <Grid item xs style={{marginLeft: "3rem"}}>
                                    <div><b>OrderCloud Marketplace</b></div>
                                </Grid>
                            </Grid>
                            {connections.map((connection, index) => {
                                return <Grid container key={index} style={{marginTop: "0.75rem"}}>
                                    <Grid item xs>
                                        <FormControl>
                                            <Select 
                                                disabled={disableProjectSelect}
                                                variant="outlined"
                                                onChange={(event) => setConnectionProject(index, event.target.value as string)}
                                                style={{width: "210px"}}
                                                value={connection.project.id}>
                                                {allProjects.map(project => {
                                                    var disabled = project.id !== connection.project.id && connections.some(c => c.project.id === project.id);
                                                    return <MenuItem key={project.id} disabled={disabled} value={project.id}>{project.name}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs style={{textAlign: "center", marginTop: '0.75rem'}}>&#x2190; links to &#x2192;</Grid>
                                    <Grid item xs>
                                        <FormControl>
                                            <Select
                                                disabled={disableMarketplaceSelect}
                                                variant="outlined"
                                                style={{width: "210px"}}
                                                onChange={(event) => setConnectionMarketplace(index, event.target.value as string)}
                                                value={connection.ID}>
                                                {allMarketplaces.map(marketplace => {
                                                    return <MenuItem key={marketplace.ID} value={marketplace.ID}>{`${marketplace.Name} (ID: "${marketplace.ID}")`}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={1} style={{marginTop: "1rem", marginLeft: "1.5rem", cursor: "pointer"}}>
                                        { index !== 0 &&  <div onClick={() => removeConnection(index)}><FontAwesomeIcon size="lg" icon={faTimes}/></div> }            
                                    </Grid>
                                </Grid>
                            })}
                        </Grid>
                        </div>
                    </div>
                    { showAddProject && <VercelButton variant="primary" style={{marginLeft: "1.5rem", marginBottom: "1rem"}} onClick={addNewConnection}><FontAwesomeIcon style={{marginRight: "0.5rem"}} icon={faPlusCircle}/> Add Another Vercel Project ({unConnectedProjects.length} Remaining)</VercelButton>}
                </div>
                <div className="mt-5" style={{float: "right"}}>
                    <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="large"
                    onClick={() => saveAndContinue(connections)}
                    >
                    Apply Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProjectSelectView
