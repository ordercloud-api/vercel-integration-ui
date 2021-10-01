import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, Button, Grid, MenuItem, Select } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react'
import { NEW_PROJECT_CODE } from '../../services/constants';
import { VercelProject } from '../../types/VercelProject'
import { Button as VercelButton } from '../vercel-ui'
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { isNil } from 'lodash';
import { Organization } from '@ordercloud/portal-javascript-sdk';
import { ConnectedProject } from '../../types/ConnectedProject';
import ProgressLoader from '../ordercloud-ui/ProgressLoader';


const ProjectSelectView: FC<{
  onSelectProjects: (selctions: ConnectedProject[]) => void,
  allProjects: VercelProject[],
  allMarketplaces: Organization[],
  currentProjectId: string,
  savedConnections: ConnectedProject[],
}> = ({ onSelectProjects, allProjects, allMarketplaces, currentProjectId, savedConnections }) => {

    var selectedProject = allProjects.find(p => p.id === currentProjectId);

    selectedProject = selectedProject || allProjects[0];

    var newMarketplace = { Id: NEW_PROJECT_CODE, Name: "Seed new Marketplace" };
    var init = (savedConnections.length > 0 && !currentProjectId) ? [...savedConnections] : [{ project: selectedProject, marketplace: newMarketplace}];

    const [connections, setConnections] = useState<ConnectedProject[]>(init);
    const [loading, setLoading] = useState(false);
    const [useMobileView, setUseMobileView] = useState(false);

    if (!allMarketplaces.find(m => m.Id === NEW_PROJECT_CODE)) {
        allMarketplaces.unshift({ Id: NEW_PROJECT_CODE, Name: "Seed new Marketplace" });
    }

    var unConnectedProjects = allProjects.filter(p => !connections.some(cp => cp.project.id === p.id));

    var disableProjectSelect = !isNil(currentProjectId) || allProjects.length < 2;
    var disableMarketplaceSelect = allMarketplaces.length < 2;
    var showAddProject = unConnectedProjects.length > 0 && isNil(currentProjectId);

    if (disableProjectSelect && disableMarketplaceSelect) {
        // skip project select step
        onSelectProjects(connections);
    }

    useEffect(() => {
        function handleResize() {
            setUseMobileView(window.innerWidth < 640);
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    const addNewConnection = () => {
        setConnections(oldConnections => [...oldConnections, { project: unConnectedProjects[0], marketplace: newMarketplace}]);
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
        var marketplace = allMarketplaces.find(x => x.Id === marketplaceID);
        setConnections(oldConnections => {
            console.log(oldConnections);
            var connection = oldConnections[index];
            var newConection = { marketplace, project: connection.project }
            oldConnections[index] = newConection;
            console.log([...oldConnections]);

            return [...oldConnections];
        });
    }  

    
    const saveAndContinue = async () => {
        setLoading(true);
        try {
            await onSelectProjects(connections);
        } finally {
            setLoading(false);
        }
    }  


    console.log("connections", connections);
    console.log("all marketplaces", allMarketplaces);

    return (
        <div className="flex justify-center min-h-screen overflow-visible font-sans antialiased bg-primary-100">
            <div className="py-6 w-full md:max-w-3xl md:mt-8">
                <img src='/oc_banner_logo.svg' style={{width: "350px", paddingBottom: "1rem", paddingLeft: "1.5rem"}} alt='OrderCloud'/>
                <div className="rounded border border-primary-200 bg-white">
                    <div style={{padding: "1.5rem"}}>
                        <h4 style={{fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600}}>Connection Details</h4>
                        <p style={{fontSize: "0.875rem", lineHeight: "1.25rem", marginTop: "0.75rem"}}>A new deployment is required for changes to take effect.</p>
                        <div style={{marginTop: "1.5rem"}}>
                        { !useMobileView &&
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
                                                    value={connection.marketplace.Id}>
                                                    {allMarketplaces.map(marketplace => {
                                                        return <MenuItem key={marketplace.Id} value={marketplace.Id}>{`${marketplace.Name} (ID: "${marketplace.Id}")`}</MenuItem>
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
                        }
                        { useMobileView && 
                            <div>
                                { connections.map((connection, index) => {
                                    return <div className="rounded border border-primary-200 bg-white m-4">
                                        <div style={{margin: "1.25rem"}}>
                                            <div><b>Vercel Project</b></div>
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
                                        </div>
                                        <div style={{margin: "1.25rem"}}>
                                            <div><b>OrderCloud Marketplace</b></div>
                                            <FormControl >
                                                <Select
                                                    disabled={disableMarketplaceSelect}
                                                    variant="outlined"
                                                    style={{width: "210px"}}
                                                    onChange={(event) => setConnectionMarketplace(index, event.target.value as string)}
                                                    value={connection.marketplace.Id}>
                                                    {allMarketplaces.map(marketplace => {
                                                        return <MenuItem key={marketplace.Id} value={marketplace.Id}>{`${marketplace.Name} (ID: "${marketplace.Id}")`}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        { index !== 0 && <div style={{margin: "1.25rem", color:"red"}} onClick={() => removeConnection(index)}>Remove</div> }
                                    </div>
                                })}
                            </div>
                        }   
                        </div>
                    </div>
                    { showAddProject && <VercelButton variant="primary" style={{marginLeft: "1.5rem", marginBottom: "1rem"}} onClick={addNewConnection}><FontAwesomeIcon style={{marginRight: "0.5rem"}} icon={faPlusCircle}/> Add Another Vercel Project ({unConnectedProjects.length} Remaining)</VercelButton>}
                </div>
                <div className="mt-5" style={{float: "right"}}>
                    <ProgressLoader loading={loading}>
                        <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        size="large"
                        onClick={() => saveAndContinue() }
                        >
                        Apply Changes
                        </Button>
                    </ProgressLoader>
                </div>
            </div>
        </div>
    );
}

export default ProjectSelectView
