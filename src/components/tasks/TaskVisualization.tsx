import { useEffect, useRef } from 'react';
import { type Task } from '../../types/Task';
import * as d3 from 'd3';

interface TaskVisualizationProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
}

const TaskVisualization = ({ tasks, onTaskSelect, selectedTaskId }: TaskVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate remaining effort (1 - percent_completed) * effort
  const getRemainingEffort = (task: Task): number => {
    return (1 - task.percent_completed) * task.effort;
  };

  // Calculate urgency based on due date (closer = more urgent)
  const getUrgency = (task: Task): number => {
    if (!task.due_date) return 0;

    const now = new Date();
    const dueDate = new Date(task.due_date);
    const daysUntilDue = Math.max(0, Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Inverse relationship: fewer days = higher urgency
    // Max urgency (1) if due today or overdue, min urgency (0.1) if due in 30+ days
    return Math.max(0.1, Math.min(1, 1 - (daysUntilDue / 30)));
  };

  // Calculate circle size based on remaining effort and urgency
  const getCircleSize = (task: Task): number => {
    const remainingEffort = getRemainingEffort(task);
    const urgency = getUrgency(task);

    // Base size between 10-50 based on remaining effort (1-10)
    const baseSize = 10 + (remainingEffort * 4);

    // Increase size based on urgency (up to 50% larger for most urgent tasks)
    return baseSize * (1 + (urgency * 0.5));
  };

  // Get opacity based on priority (higher priority = more opaque)
  const getOpacity = (task: Task): number => {
    // Priority is 1-4, normalize to 0.4-1 range
    return 0.4 + ((task.priority - 1) / 3) * 0.6;
  };

  // Make all tasks red as per requirements
  const getColor = (task: Task): string => {
    return '#8B0000'; // dark red (matching the app's theme)
  };

  useEffect(() => {
    if (!svgRef.current || tasks.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create force simulation with parameters to prevent overlapping
    const simulation = d3.forceSimulation(tasks as d3.SimulationNodeDatum[])
      .force('charge', d3.forceManyBody().strength(-100)) // Increased repulsion force to push nodes apart
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.15)) // Center attraction
      .force('collision', d3.forceCollide().radius((d: any) => getCircleSize(d as Task) + 2).strength(1)) // Full collision radius plus padding
      .alphaDecay(0.01) // Slower decay to allow more time for collision resolution
      .velocityDecay(0.2); // Reduced velocity decay to allow nodes to move more freely

    // Create a group for each task (circle + text)
    const taskGroups = svg.selectAll('g')
      .data(tasks)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        onTaskSelect(d);
      });

    // Add circles to each group
    taskGroups.append('circle')
      .attr('r', d => getCircleSize(d))
      .attr('fill', d => getColor(d))
      .attr('opacity', d => getOpacity(d))
      .attr('stroke', d => d.id === selectedTaskId ? '#8B0000' : 'none')
      .attr('stroke-width', d => d.id === selectedTaskId ? 3 : 0);

    // Add text labels to each group
    taskGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', 'white')
      .attr('font-size', d => Math.max(10, getCircleSize(d) / 3))
      .attr('pointer-events', 'none')
      .text(d => d.title.length > 10 ? d.title.substring(0, 10) + '...' : d.title);

    // Add tooltips
    taskGroups.append('title')
      .text(d => `${d.title} (${Math.round(d.percent_completed * 100)}% complete)`);

    // Add a boundary force to keep nodes within the visible area
    simulation.force('x', d3.forceX(width / 2).strength(0.1));
    simulation.force('y', d3.forceY(height / 2).strength(0.1));

    // Update group positions on simulation tick with strict boundary enforcement
    simulation.on('tick', () => {
      // Apply additional boundary constraints to ensure no overflow
      tasks.forEach((d: any) => {
        const radius = getCircleSize(d as Task);
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        d.y = Math.max(radius, Math.min(height - radius, d.y));
      });

      taskGroups.attr('transform', (d: any) => {
        return `translate(${d.x},${d.y})`;
      });
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [tasks, selectedTaskId, onTaskSelect]);

  return (
    <div className="w-full h-full">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default TaskVisualization;
