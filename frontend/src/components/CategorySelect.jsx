function CategorySelect({ categories, selectedCategory, onChange }) {
  return (
    <label className="categorySelect">
      <span>Категория слов</span>

      <select
        value={selectedCategory}
        onChange={(event) => onChange(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CategorySelect;