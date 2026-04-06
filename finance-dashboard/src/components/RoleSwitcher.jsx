import useFinanceStore from '../store/useFinanceStore'

export default function RoleSwitcher() {
  const { role, setRole } = useFinanceStore()

  return (
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="px-4 py-2 rounded-xl border dark:bg-slate-800"
    >
      <option value="viewer">Viewer</option>
      <option value="admin">Admin</option>
    </select>
  )
}