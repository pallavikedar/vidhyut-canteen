"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MenuItem } from "@/lib/menu"
import { menuService } from "@/lib/menu"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    halfPrice: 0,
    fullPrice: 0,
    category: "",
    isAvailable: true,
  })

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      const items = await menuService.getAllMenuItems()
      setMenuItems(items)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (editingItem) {
      await menuService.updateMenuItem(editingItem.$id, formData);
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    } else {
      console.log("Submitting payload:", formData); // Log before send for verification
      await menuService.addMenuItem(formData);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    }
    await loadMenuItems();
    resetForm();
    setIsDialogOpen(false);
  } catch (error: any) {
    console.error("Appwrite error details:", error, error.code, error.message, error.type); // Detailed log
    toast({
      title: "Error",
      description: `Failed to save menu item: ${error.message || "Unknown error"} (Code: ${error.code || "N/A"})`,
      variant: "destructive",
    });
  }
};

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      halfPrice: item.halfPrice,
      fullPrice: item.fullPrice,
      category: item.category,
      isAvailable: item.isAvailable,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await menuService.deleteMenuItem(id)
        await loadMenuItems()
        toast({
          title: "Success",
          description: "Menu item deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete menu item",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
  try {
    await menuService.toggleAvailability(item.$id, !item.isAvailable)
    await loadMenuItems()
    toast({
      title: "Success",
      description: "Item availability updated",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update availability",
      variant: "destructive",
    })
  }
}


  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      halfPrice: 0,
      fullPrice: 0,
      category: "",
      isAvailable: true,
    })
    setEditingItem(null)
  }

  // const categories = Array.from(new Set(menuItems.map((item) => item.category))).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage menu items</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the menu item details" : "Add a new item to the menu"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="halfPrice">Half Price (₹)</Label>
                    <Input
                      id="halfPrice"
                      type="number"
                      min="0"
                      value={formData.halfPrice}
                      onChange={(e) => setFormData({ ...formData, halfPrice: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullPrice">Full Price (₹)</Label>
                    <Input
                      id="fullPrice"
                      type="number"
                      min="0"
                      value={formData.fullPrice}
                      onChange={(e) => setFormData({ ...formData, fullPrice: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      
                      <SelectItem value="North Indian">Breakfast</SelectItem>
                      <SelectItem value="South Indian">Thali</SelectItem>
                      
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                     
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update" : "Add"} Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>Manage your restaurant menu items</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading menu items...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Half Price</TableHead>
                  <TableHead>Full Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.$id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell>₹{item.halfPrice}</TableCell>
                    <TableCell>₹{item.fullPrice}</TableCell>
                    <TableCell>
                      <Badge variant={item.isAvailable ? "default" : "secondary"}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleToggleAvailability(item)}>
  {item.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.$id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
