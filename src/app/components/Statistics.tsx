import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useEvents } from '../hooks/useEvents';
import { formatDuration } from '../utils/format';
import '../styles/Staff.css';
//import EmplDetails from './statistics/EmplDetails'
import StatDetails from './statistics/StatDetails'

const calendar = {
  year: Array.from({ length: 3 }, (_, i) => (new Date().getFullYear()) - 1 + i),
  month: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'long' })
  })),
}

const MONTH_NOW = new Date().getMonth() + 1;
const YEAR_NOW = new Date().getFullYear();
export const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];


const Statistics = () => {


  const { events, reloadEvents } = useEvents({props: 'all'});
  
  const [statistics, setStatistics] = useState({
    totalProjects: 0,
    totalEmployees: 0,
    projects: [],
    departments: [],
    monthlyData: [],
    annualActivity: [],
    topProjects: [],
    emplStats: []
  });
  
  const [statDetails, setStatDetails] = useState(null)
  const [activeUser, setActiveUser] = useState('')
  const [activeChart, setActiveChart] = useState(''); // projects, departments, empls
  const [activeSubChart, setActiveSubChart] = useState(null) //names of projects OR names of departments
  const [activeSubChartItem, setActiveSubChartItem] = useState('All')
    
  const [period, setPeriod] = useState({
    current: 'month',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth()+1, 1),
  })

  const changePeriod = (e) => {

    if (e.target.value === 'year' ) {
      setPeriod({
        current: e.target.value,
        start: new Date(new Date().getFullYear() - 1, 11, 31),
        end: new Date(new Date().getFullYear(), 11, 31),
      })
      console.log('current year period: ', period)
      
    } else if (e.target.value === 'month' ) {
      setPeriod({
        current: e.target.value,
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth()+1, 1),
      })
      console.log('current month period: ', period)
      
    } else if (e.target.value.length < 4) { //Month
      const monthIndex = e.target.value;
      const year = new Date().getFullYear()
      setPeriod({
        ...period,
        start: new Date(year, monthIndex - 1, 0),
        end: new Date(year, monthIndex, 1),
      })
      console.log('month period: ', period, year)
      
    } else {                                 //Year
      const year = e.target.value;
      setPeriod({
        ...period,
        start: new Date(year - 1, 11, 31),
        end: new Date(year, 11, 31),
      })
      console.log('year period: ', period)
    }
  }
  
  const getSubChart = (chart) => {
    const target = chart === 'departments' ? 'dept' : 'project';
    const subChart = new Set(events.map(item => item[target]))
    setActiveSubChart(['All', ...subChart]) //convert set to Array
    setActiveSubChartItem('All')
  }
  
  const getUserDetails = (user: string) => {
    setActiveUser(user)
    const project = activeSubChartItem;
    
    const result = events
    .filter(item => item.project === project && item.name === user)
    .reduce((acc, item) => {
      const { name, title } = item;
      
      let existingName = acc.find(i => i.name === name);
      if (!existingName) {
        existingName = { name: name, dept: item.dept, data: [] };
        acc.push(existingName);
      }
      
      const existingTitle = existingName.data.find(i => i.title === title)
      if (existingTitle) {
        existingTitle.value += parseFloat(item.length);
        existingTitle.entries += 1;
        
      } else {
        existingName.data.push({
          title: item.title,
          value: parseFloat(item.length),
          entries: 1,
          
        });
      }
      return acc;
    }, []);
      
    setStatDetails(result)
  }
  
  const getDeptDetails = (e: {}) => {
    
    const project = e.payload.project
    const dept = Object.entries(e.payload)
    .map((item) => item[1] == e.value && item[0])
    .filter(Boolean)[0]; // Get the first truthy value
    //console.log(e)
    
    const result = events
    .filter(item => item.dept == dept && item.project == project)
    //.filter(item => item.project === targetProject)
    .reduce((acc, item) => {
      const { dept, name, title, length } = item;
      const groupName = `${name}`;
      const numLength = parseFloat(length);
      
      // Find or create department group
      let deptGroup = acc.find(group => group.name === groupName);
      if (!deptGroup) {
        deptGroup = { name: groupName, data: [] };
        acc.push(deptGroup);
      }
      
      // Update title sum
      const titleEntry = deptGroup.data.find(entry => entry.title === title);
      if (titleEntry) {
        titleEntry.value += numLength;
        titleEntry.entries += 1;
      } else {
        deptGroup.data.push({ title, value: numLength, entries: 1 });
      }
      
      return acc;
    }, []);
    //console.log(result)
    setStatDetails(result)
  }


  const initialAccumulator = calendar.month.map(m => ({
    month: m.name.slice(0, 3),
  }));

  useEffect(() => {
    const fetchStatistics = async () => {
      // This would be your actual API call
      // const response = await fetch('/api/staff-statistics');
      // const data = await response.json();

      // Mock data based on your database structure
      const mockData = {
        totalProjects: new Set(events.map(item => item.project)).size,
        totalEmployees: new Set(events.map(item => item.author)).size,
        totalDepts: new Set(events.map(item => item.dept)).size,
        
        projects: events
        .reduce((acc, item) => {
          const existingProject = acc.find(i => i.project === item.project);
          
          if (new Date(item.start) > period.start && new Date(item.end) < period.end) {
            if (!existingProject) {
              // First time seeing this project
              acc.push({
                project: item.project,
                totalDuration: parseFloat(item.length)
              });
            } else {
              // Add to existing project's duration
              existingProject.totalDuration += parseFloat(item.length);
            }
          } 
          return acc;
        }, [])
        .map(project => {
          return { 
            name: project.project, 
            value: project.totalDuration, 
            duration: formatDuration(project.totalDuration), 
          }
        }),
        //######################################################################################
        currentProject: events
        .reduce((acc, event) => {
          const existingName = acc.find(i => i.name === event.name);
          
          if (new Date(event.start) > period.start && new Date(event.end) < period.end && event.project === activeSubChartItem) {
            if (!existingName) {
              acc.push({
                name: event.name,
                title: event.title,
                totalDuration: parseFloat(event.length)
              });
            } else {
              existingName.totalDuration += parseFloat(event.length);
            }
          }
          return acc;
        }, [])
        .map(project => {
          return { 
            name: project.name, 
            value: project.totalDuration, 
            duration: formatDuration(project.totalDuration), 
          }
        }),
        departments: events.reduce((acc, item) => {
          const { project, dept, length } = item;
          const lengthNum = parseFloat(length);
          
          // Find if project already exists in accumulator
          const existingProject = acc.find(p => p.project === project);
          
          if (new Date(item.start) > period.start && new Date(item.end) < period.end) {
            if (existingProject) {
              // If project exists, add to the department total
              if (existingProject[dept]) {
                existingProject[dept] += lengthNum;
              } else {
                existingProject[dept] = lengthNum;
              }
            } else {
              // If project doesn't exist, create new project entry
              const newProject = { project };
              newProject[dept] = lengthNum;
              acc.push(newProject);
            }
          }
          
          return acc;
        }, []),
        
        monthlyData: [
          { month: 'Jan', entries: 12, duration: 35.5 },
          { month: 'Feb', entries: 18, duration: 52.8 },
          { month: 'Mar', entries: 15, duration: 44.2 },
          { month: 'Apr', entries: 22, duration: 64.7 },
          { month: 'May', entries: 19, duration: 55.9 },
          { month: 'Jun', entries: 25, duration: 73.4 }
        ],
        annualActivity: events.reduce((acc, item) => {
          if (new Date(item.start) > period.start && new Date(item.end) < period.end) {
          
            const month = new Date(item.start).toLocaleString('default', { month: 'short' });
            const existMonth = acc.find(i => i.month === month);
            console.log(existMonth)
            //if (existMonth) {
              if (!existMonth[item.project]) {
                existMonth[item.project] = parseFloat(item.length);
              } else {
                existMonth[item.project] += parseFloat(item.length);
              }
            //}
          }
          
          return acc;
        }, initialAccumulator),
        
        topProjects: [
          { project: 'Project Alpha', hours: 132.25, entries: 45 },
          { project: 'Project Beta', hours: 118.75, entries: 38 },
          { project: 'Project Gamma', hours: 85.33, entries: 28 },
          { project: 'Internal Tasks', hours: 67.42, entries: 22 },
          { project: 'Client Support', hours: 54.15, entries: 18 }
        ],
        emplStats: events.reduce((acc, item) => {
          const { length, name } = item;
          const lengthNum = parseFloat(length);
          
          // Find if user already exists in accumulator
          const existingName = acc.find(item => item.name === name);
          
          if (new Date(item.start) > period.start && new Date(item.end) < period.end) {
            if (existingName) {
              existingName.hours += lengthNum;

            } else {
              // If user doesn't exist, create new user entry
              const newUser = { name };
              newUser.hours = lengthNum;
              acc.push(newUser);
            }
          }
          
          //console.log(acc)
          return acc;
        }, []),
      };

      setStatistics(mockData);
    };

    fetchStatistics();
  }, [events, period, activeSubChartItem]);
  
  const projects = [...new Set(events.map(item => item.project))];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];
  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p className="label" style={{ fontWeight: '600', marginBottom: '5px' }}>{`Project ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index} 
              //style={{ color: entry.color, fontSize: '0.875rem' }}>
              style={{ color: COLORS[index % COLORS.length], fontSize: '0.875rem' }}>
              {`${entry.name}: ${entry.value}${entry.dataKey && entry.dataKey.includes('duration') ? ' h' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="staff-statistics" style={{
      background: 'var(--background-primary)',
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      minWidth: '80%'
      //margin: '2rem 0'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Statistics Dashboard
        </h2>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--background-secondary)',
          padding: '0 1.5rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          height: '6rem'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Total Projects
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {statistics.totalProjects}
          </p>
        </div>

        <div style={{
          background: 'var(--background-secondary)',
          padding: '0 1.5rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          height: '6rem'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Total Employees
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
            {statistics.totalEmployees}
          </p>
        </div>

        <div style={{
          background: 'var(--background-secondary)',
          padding: '0 1.5rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          height: '6rem'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Total Departments
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>
            {statistics.totalDepts}
          </p>
        </div>
      </div>

      {/* Chart Controls Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['projects', 'departments', 'employees'].map((chart) => (
            <button
              key={chart}
              onClick={() => {
                setActiveChart(chart)
                getSubChart(chart)
                setActiveUser('')
                setStatDetails('')
                chart === 'employees' && setActiveSubChart('')
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${activeChart === chart ? 'var(--primary-color)' : 'var(--border-color)'}`,
                background: activeChart === chart ? 'var(--primary-color)' : 'var(--background-primary)',
                color: activeChart === chart ? 'white' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none',
                transition: 'var(--transition)'
              }}
            >
              {chart.charAt(0).toUpperCase() + chart.slice(1)}
            </button>
          ))}
        </div>
        {/*FILTERS*/}
        <div>
          <span style={{color: 'var(--text-secondary)', fontSize: '.875rem', fontWeight: 500}}>Filter:  </span>
          <select
            //value={period}
            onChange={changePeriod}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              background: 'var(--background-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              marginRight: '1rem',
              minWidth: '8rem',
            }}
          >
            <option value="month">by Month</option>
            <option value="year">by Year</option>
          </select>

          <select
            defaultValue={period.current === 'month' ? MONTH_NOW : YEAR_NOW}
            key={period.current === 'month' ? MONTH_NOW : YEAR_NOW}
            onChange={changePeriod}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              background: 'var(--background-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              minWidth: '8rem',
            }}
          >
            {
              period.current === 'month'
              ? (
                calendar.month.map(item => {
                  return <option key={item.id} value={item.id}>{item.name}</option> 
                })
              )
              : (
                calendar.year.map(item => {
                  return <option key={item} value={item}>{item}</option>
                })
              )
            }
          </select>
        </div>
      </div>
      
      {/* Chart Controls Buttons  second row */}
      {activeChart && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeSubChart && activeSubChart.map((prj) => (
                <button
                  key={prj}
                  onClick={() => {
                    setActiveSubChartItem(prj)
                    setActiveUser('')
                    setStatDetails('')
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${activeSubChartItem === prj ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    background: activeSubChartItem === prj ? 'var(--primary-active)' : 'var(--background-primary)',
                    color: activeSubChartItem === prj ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'var(--transition)'
                  }}
                >
                  {prj.charAt(0).toUpperCase() + prj.slice(1)}
                </button>
              ))}
            </div>
          </div>
      )}

      {/* Charts */}
      <div style={{ marginBottom: '2rem' }}>
        {activeChart === 'projects' && activeSubChartItem === 'All' && period.current === 'month' && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>All projects</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={400}>
                  (<Pie
                    data={statistics.projects.length > 0 ? statistics.projects : [{ name: 'No data', value: 0 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, duration }) => `Project ${name} (${(percent * 100).toFixed(0)}%) - ${duration}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    { statistics.projects.length > 0 ?
                      statistics.projects.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        />
                      ))
                      :
                      [{ name: 'No data', value: 0 }].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === 'No data' ? '#e0e0e0' : COLORS[index % COLORS.length]} 
                        />
                      ))
                    }
                  </Pie>)
                {/*<Tooltip />*/}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* STATISTIC BY EMPLOYEES*/}
        {activeChart === 'projects' && activeSubChartItem !== 'All' && period.current === 'month' && (
          <div >
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Project {activeSubChartItem}
</h3>
            <ResponsiveContainer width="100%" height={300} >
              <PieChart width={400} height={400} >
                  (<Pie
                    data={statistics.currentProject.length > 0 ? statistics.currentProject : [{ name: 'No data', value: 0 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, duration }) => `${name} (${(percent * 100).toFixed(0)}%) - ${duration}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(e) => {getUserDetails(e.name)}}
                  >
                    { statistics.projects.length > 0 ?
                      statistics.projects.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{ cursor: 'pointer', outline: 'none', }}
                        />
                      ))
                      :
                      [{ name: 'No data', value: 0 }].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === 'No data' ? '#e0e0e0' : COLORS[index % COLORS.length]} 
                        />
                      ))
                    }
                  </Pie>)
                {/*<Tooltip />*/}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        

        {activeChart === 'departments' && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Departments Workload</h3>
            <ResponsiveContainer width="100%" height={300} style={{ outline: 'none'}}>
              <BarChart
                data={statistics.departments}
                style={{ outline: 'none'}}
              >
                <CartesianGrid strokeDasharray="3 3" style={{ outline: 'none'}}/>
                <XAxis dataKey="project" style={{ outline: 'none'}}/>
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {statistics.departments && statistics.departments.length > 0 ? 
                  // Get all department keys (excluding 'project')
                  (Object.keys(statistics.departments[0] || {})
                    .filter(key => key !== 'project')
                    .map((deptKey, index) => (
                      <Bar
                        onClick={(e) => {getDeptDetails(e)}}
                        key={deptKey}
                        dataKey={deptKey}
                        fill={COLORS[index % COLORS.length]}
                        style={{cursor: 'pointer', outline: 'none'}}
                        name={deptKey} 
                      />
                    ))
                  )
                  : (
                    [{ name: 'No data', value: 0 }].map((entry, index) => (
                      <Bar 
                        key={`no-data-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        name={entry.name}
                        dataKey={entry.name}
                      />
                    ))
                  )
                }
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'timeline' && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Monthly Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statistics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="entries" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Entries" />
                <Area type="monotone" dataKey="duration" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Duration (hours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'employees' && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Employees Workload</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.emplStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="hours"/>
                <Tooltip />
                <Legend />
                {statistics.emplStats.length > 0 ?
                  <Bar
                    key="name"
                    dataKey="hours"
                    fill="#6366f1" 
                    name="Hours"
                  />
                  :
                  <Bar 
                    key="no-data" 
                    dataKey="value"
                    //fill="#ccc"
                    name="No data available"
                  />
                }
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Additional Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {
          period.current !== 'month' ?
            // Projects annual activity
          (<div style={{
            background: 'var(--background-secondary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Projects annual activity</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statistics.annualActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {projects.map((project, index) => {
                  //console.log(statistics.annualActivity)
                  return <Bar 
                    key={project} 
                    dataKey={project} 
                    stackId="a" 
                    fill={colors[index % colors.length]}
                    name={`Project ${project}`}
                  />
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>)
          :
          ( <StatDetails
              statDetails={statDetails}
              activeUser={activeUser}
            />
          )
          
        }
      </div>
    </div>
  );
};

export default Statistics;
