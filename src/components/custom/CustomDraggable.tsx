import { useDrag } from 'react-dnd';

interface DraggableRowProps {
  item: Record<string, any>;
  index: number;
  columns: { selector: string }[];
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableRow = ({ item, index, columns }: DraggableRowProps) => {
  const [, ref] = useDrag({
    type: 'ROW',
    item: { index },
  });

  return (
    <div ref={ref} style={{ cursor: 'move' }}>
      {columns.map((column: { selector: string }, colIndex: number) => (
        <div key={colIndex}>{item[column.selector]}</div>
      ))}
    </div>
  );
};

export default DraggableRow;

