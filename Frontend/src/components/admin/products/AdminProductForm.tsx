function AdminProductForm() {
  return (
    <form className="space-y-4 rounded-lg border bg-background p-6">
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <input className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label className="text-sm font-medium">Price</label>
        <input type="number" className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label className="text-sm font-medium">Status</label>
        <select className="mt-1 w-full rounded border px-3 py-2">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <button className="rounded bg-primary px-4 py-2 text-white">
        Save Product
      </button>
    </form>
  );
}

export default AdminProductForm;
