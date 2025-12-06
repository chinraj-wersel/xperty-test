import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GripVertical } from 'lucide-react'

const DraggableDashboard = ({ widgets, onDragEnd, renderWidget }) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="dashboard-grid" direction="horizontal">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {widgets.map((widget, index) => (
                            <Draggable
                                key={widget.id}
                                draggableId={widget.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`h-full ${snapshot.isDragging ? 'z-50' : ''}`}
                                        style={{
                                            ...provided.draggableProps.style,
                                        }}
                                    >
                                        <div className="h-full relative group">
                                            {/* Drag Handle - visible on hover or when dragging */}
                                            <div
                                                {...provided.dragHandleProps}
                                                className={`absolute top-3 right-12 p-1 text-brand-400 hover:text-brand-600 cursor-grab active:cursor-grabbing rounded hover:bg-brand-50 transition-opacity ${snapshot.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    } z-10`}
                                            >
                                                <GripVertical className="w-4 h-4" />
                                            </div>

                                            {/* Widget Content */}
                                            {renderWidget(widget)}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default DraggableDashboard
