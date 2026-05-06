import React from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates, 
} from '@dnd-kit/sortable';
import { Task, Status } from '../types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

const STATUSES: Status[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: Status) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  canUpdateStatus: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
}

export default function KanbanBoard({ 
  tasks, 
  onStatusChange, 
  onEditTask, 
  onDeleteTask,
  canUpdateStatus,
  canDeleteTask
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task && canUpdateStatus(task)) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;
    const task = tasks.find(t => t.id === activeId);

    if (!task || !canUpdateStatus(task)) return;

    // 1. Drop over a column
    if (STATUSES.includes(overId as Status)) {
      onStatusChange(activeId, overId as Status);
      return;
    }

    // 2. Drop over a task in another column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && overTask.status !== activeTask?.status) {
      onStatusChange(activeId, overTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-4 items-start">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            id={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            canUpdateStatus={canUpdateStatus}
            canDeleteTask={canDeleteTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: { active: { opacity: '0.5' } }
        })
      }}>
        {activeTask ? (
          <TaskCard 
            task={activeTask} 
            isOverlay 
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            canMoveTask={canUpdateStatus(activeTask)}
            canDelete={canDeleteTask(activeTask)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
