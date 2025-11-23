const TagChip = ({ label, color }) => {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: `${color}22`,
        color,
        borderColor: `${color}44`,
      }}
    >
      {label}
    </span>
  );
};

export default TagChip;
