import { useEffect, useRef, useState } from 'react';
import { type Task } from '../../types/Task';
import * as d3 from 'd3';

interface TaskVisualizationProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
}

const TaskVisualization = ({ tasks, onTaskSelect, selectedTaskId }: TaskVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Calculate remaining effort (1 - percent_completed) * effort
  const getRemainingEffort = (task: Task): number => {
    return (1 - task.percent_completed / 100) * task.effort;
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
    const priority = task.priority;

    // Base size between 10-50 based on remaining effort (1-10)
    const baseSize = 10 + (remainingEffort * 4);

    // Increase size based on urgency (up to 100% larger for most urgent tasks)
    // Also factor in priority (higher priority = larger)
    const urgencyFactor = urgency * 1.0; // Doubled from 0.5 to 1.0
    const priorityFactor = (priority - 1) / 3 * 0.5; // Additional 0-50% based on priority

    return baseSize * (1 + urgencyFactor + priorityFactor);
  };

  // Get opacity based on priority (higher priority = more opaque)
  const getOpacity = (task: Task): number => {
    // Priority is 1-4, normalize to 0.6-1 range (darker overall)
    return 0.6 + ((task.priority - 1) / 3) * 0.4;
  };

  // Make all tasks red as per requirements
  const getColor = (task: Task): string => {
    return '#8B0000'; // dark red (matching the app's theme)
  };

  useEffect(() => {
    // Reset simulation state when tasks or selectedTaskId changes
    setSimulationComplete(false);

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
        // Just select the task without applying any force
        onTaskSelect(d);
      });

    // Add circles to each group
    taskGroups.append('circle')
      .attr('r', d => getCircleSize(d))
      .attr('fill', d => getColor(d))
      .attr('opacity', d => getOpacity(d))
      .attr('stroke', d => d.id === selectedTaskId ? '#8B0000' : 'none')
      .attr('stroke-width', d => d.id === selectedTaskId ? 3 : 0);

    // Add multi-line text labels to each group (up to 3 lines)
    taskGroups.each(function(d) {
      const group = d3.select(this);
      const fontSize = Math.max(10, getCircleSize(d) / 3);
      const title = d.title;

      // Calculate how many characters can fit per line based on circle size
      const charsPerLine = Math.max(8, Math.floor(getCircleSize(d) / (fontSize * 0.6)));

      // Split text into words
      const words = title.split(/\s+/);
      let lines = [];
      let currentLine = '';

      // Create lines of text
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= charsPerLine) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });

      // Add the last line
      if (currentLine) {
        lines.push(currentLine);
      }

      // Limit to 3 lines
      if (lines.length > 3) {
        lines = lines.slice(0, 3);
        // Add ellipsis to the last line if it was truncated
        if (lines[2].length > charsPerLine - 3) {
          lines[2] = lines[2].substring(0, charsPerLine - 3) + '...';
        } else {
          lines[2] += '...';
        }
      }

      // Add each line as a separate text element
      lines.forEach((line, i) => {
        group.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `${(i - (lines.length - 1) / 2) * 1.2 + 0.3}em`) // Position lines vertically
          .attr('fill', 'white')
          .attr('font-size', fontSize)
          .attr('pointer-events', 'none')
          .text(line);
      });
    });

    // Add tooltips
    taskGroups.append('title')
      .text(d => `${d.title} (${Math.round(d.percent_completed)}% complete)`);

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

    // Stop the simulation after a short time to prevent movement after initial positioning
    // This removes any force application after the initial layout
    setTimeout(() => {
      simulation.stop();
      setSimulationComplete(true);
    }, 2000);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [tasks, selectedTaskId, onTaskSelect]);

  return (
    <div className="w-full h-full">
      {!simulationComplete && tasks.length > 0 && (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0000]"></div>
        </div>
      )}
      <svg 
        ref={svgRef} 
        className={`w-full h-full ${!simulationComplete ? 'invisible' : ''}`}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default TaskVisualization;
