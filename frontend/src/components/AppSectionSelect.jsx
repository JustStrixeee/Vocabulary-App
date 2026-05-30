function AppSectionSelect({ appSection, onChange }) {
  return (
    <label className="sectionSelect">
      <span>Раздел</span>

      <select
        value={appSection}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="words">Слова</option>
        <option value="phrases">Фразы из сериалов</option>
      </select>
    </label>
  );
}

export default AppSectionSelect;