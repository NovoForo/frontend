import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "@toolpad/core";
import { useNavigate } from "react-router-dom";
import { Category, Forum } from "../types";
import { ExtendedSession } from "../ExtendedSession";

const AdministratorControlPanelPage = () => {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newForum, setNewForum] = useState({ name: "", description: "" });

  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategory, setEditCategory] = useState({ name: "", description: "" });

  const [deleteCategoryId, setDeleteCategoryId] = useState("");

  const [editForumId, setEditForumId] = useState("");
  const [editForum, setEditForum] = useState({ name: "", description: "" });
  const [deleteForumId, setDeleteForumId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tabValue, setTabValue] = useState(0); // State to manage active tab
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchForums();
  }, []);

  const fetchCategories = () => {
    fetch(import.meta.env.VITE_API_URL + "/categories")
      .then(async (resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        return await resp.json();
      })
      .then((resp) => {
        setCategories(resp["Categories"]);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const fetchForums = () => {
    fetch(import.meta.env.VITE_API_URL + "/categories")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        const forums: Forum[] = [];
        if (data?.Categories && Array.isArray(data.Categories)) {
          data.Categories.forEach((category) => {
            if (category?.Forums && Array.isArray(category.Forums)) {
              category.Forums.forEach((forum: Forum) => {
                forums.push(forum);
              });
            }
          });
        }
        setForums(forums);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleAddCategory = async () => {
    await fetch(import.meta.env.VITE_API_URL + "/a/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => {
        if (response.ok) {
          setNewCategory({ name: "", description: "" });
          fetchCategories();
        } else {
          console.error("Failed to add category");
        }
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  const handleAddForum = () => {
    fetch(import.meta.env.VITE_API_URL + `/a/categories/${selectedCategory}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        name: newForum.name,
        description: newForum.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setNewForum({ name: "", description: "" });
          fetchCategories();
          fetchForums();
        } else {
          console.error("Failed to add forum");
        }
      })
      .catch((error) => {
        console.error("Error adding forum:", error);
      });
  };

  const handleEditForum = () => {
    if (!editForumId) return;
    fetch(import.meta.env.VITE_API_URL + `/a/forums/${editForumId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        name: editForum.name,
        description: editForum.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setEditForumId("");
          setEditForum({ name: "", description: "" });
          fetchCategories();
          fetchForums();
        } else {
          console.error("Failed to edit forum");
        }
      })
      .catch((error) => {
        console.error("Error editing forum:", error);
      });
  };

  const handleDeleteForum = () => {
    if (!deleteForumId) return;
    fetch(import.meta.env.VITE_API_URL + `/a/forums/${deleteForumId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setDeleteForumId("");
          fetchCategories();
          fetchForums();
        } else {
          console.error("Failed to delete forum");
        }
      })
      .catch((error) => {
        console.error("Error deleting forum:", error);
      });
  };

  const handleEditCategory = () => {
    if (!editCategoryId) return;
    fetch(import.meta.env.VITE_API_URL + `/a/categories/${editCategoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        name: editCategory.name,
        description: editCategory.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setEditCategoryId("");
          setEditCategory({ name: "", description: "" });
          fetchCategories();
        } else {
          console.error("Failed to edit category");
        }
      })
      .catch((error) => {
        console.error("Error editing category:", error);
      });
  };


  const handleDeleteCategory = () => {
    if (!deleteCategoryId) return;
    fetch(import.meta.env.VITE_API_URL + `/a/categories/${deleteCategoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setDeleteCategoryId("");
          fetchCategories();
        } else {
          console.error("Failed to delete category");
        }
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleEditForumChange = (e: any) => {
    const forumId = e.target.value;
    setEditForumId(forumId);
    const selected = forums.find((f) => f.Id === forumId);
    if (selected) {
      setEditForum({ name: selected.Name, description: selected.Description });
    }
  };

  const handleDeleteForumChange = (e: any) => {
    setDeleteForumId(e.target.value);
  };

  const handleEditCategoryChange = (e: any) => {
    const categoryId = e.target.value;
    setEditCategoryId(categoryId);
    const selectedCat = categories.find((c) => c.Id === categoryId);
    if (selectedCat) {
      setEditCategory({
        name: selectedCat.Name,
        description: selectedCat.Description,
      });
    }
  };

  const handleDeleteCategoryChange = (e: any) => {
    setDeleteCategoryId(e.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "background.paper",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Administrator Control Panel
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Add Category" />
          <Tab label="Add Forum" />
          <Tab label="Edit Category" />
          <Tab label="Edit Forum" />
          <Tab label="Delete Category" />
          <Tab label="Delete Forum" />
        </Tabs>

        {tabValue === 0 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
          >
            <Stack spacing={2}>
              <TextField
                label="Category Name"
                fullWidth
                required
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <TextField
                label="Category Description"
                fullWidth
                required
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />

              <Button variant="contained" type="submit" sx={{ mt: 1 }}>
                Add Category
              </Button>
            </Stack>
          </Box>
        )}

        {tabValue === 1 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddForum();
            }}
          >
            <Stack spacing={2}>
              <TextField
                label="Forum Name"
                fullWidth
                required
                value={newForum.name}
                onChange={(e) =>
                  setNewForum({ ...newForum, name: e.target.value })
                }
              />
              <TextField
                label="Forum Description"
                fullWidth
                required
                value={newForum.description}
                onChange={(e) =>
                  setNewForum({ ...newForum, description: e.target.value })
                }
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.Id} value={category.Id}>
                      {category.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" type="submit" sx={{ mt: 1 }}>
                Add Forum
              </Button>
            </Stack>
          </Box>
        )}

        {tabValue === 2 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditCategory();
            }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="edit-category-select-label">
                  Select Category
                </InputLabel>
                <Select
                  labelId="edit-category-select-label"
                  id="edit-category-select"
                  value={editCategoryId}
                  label="Select Category"
                  onChange={handleEditCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.Id} value={cat.Id}>
                      {cat.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Category Name"
                fullWidth
                required
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
              />
              <TextField
                label="Category Description"
                fullWidth
                required
                value={editCategory.description}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, description: e.target.value })
                }
              />

              <Button variant="contained" type="submit">
                Save Category Changes
              </Button>
            </Stack>
          </Box>
        )}

        {tabValue === 3 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditForum();
            }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="edit-forum-select-label">Select Forum</InputLabel>
                <Select
                  labelId="edit-forum-select-label"
                  id="edit-forum-select"
                  value={editForumId}
                  label="Select Forum"
                  onChange={handleEditForumChange}
                >
                  {forums.map((forum) => (
                    <MenuItem key={forum.Id} value={forum.Id}>
                      {forum.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Forum Name"
                fullWidth
                required
                value={editForum.name}
                onChange={(e) =>
                  setEditForum({ ...editForum, name: e.target.value })
                }
              />
              <TextField
                label="Forum Description"
                fullWidth
                required
                value={editForum.description}
                onChange={(e) =>
                  setEditForum({ ...editForum, description: e.target.value })
                }
              />

              <Button variant="contained" type="submit">
                Save Forum Changes
              </Button>
            </Stack>
          </Box>
        )}

        {tabValue === 4 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleDeleteCategory();
            }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="delete-category-select-label">
                  Select Category
                </InputLabel>
                <Select
                  labelId="delete-category-select-label"
                  id="delete-category-select"
                  value={deleteCategoryId}
                  label="Select Category"
                  onChange={handleDeleteCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.Id} value={cat.Id}>
                      {cat.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" color="error" type="submit">
                Delete Category
              </Button>
            </Stack>
          </Box>
        )}

        {tabValue === 5 && (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleDeleteForum();
            }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="delete-forum-select-label">Select Forum</InputLabel>
                <Select
                  labelId="delete-forum-select-label"
                  id="delete-forum-select"
                  value={deleteForumId}
                  label="Select Forum"
                  onChange={handleDeleteForumChange}
                >
                  {forums.map((forum) => (
                    <MenuItem key={forum.Id} value={forum.Id}>
                      {forum.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" color="error" type="submit">
                Delete Forum
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdministratorControlPanelPage;
