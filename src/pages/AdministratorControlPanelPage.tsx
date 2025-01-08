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
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "@toolpad/core";
import { useNavigate } from "react-router-dom";
import { Category } from "../types";
import { ExtendedSession } from "../ExtendedSession";

const AdministratorControlPanelPage = () => {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newForum, setNewForum] = useState({ name: "", description: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
          // Optionally handle success, e.g., reset form or show success message
          setNewCategory({ name: "", description: "" });
          // Refetch categories to update the list
          fetchCategories();
        } else {
          // Handle error
          console.error("Failed to add category");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
        "name": newForum.name,
        "description": newForum.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Optionally handle success, e.g., reset form or show success message
          setNewForum({ name: "", description: "" });
          // Refetch categories to update the list
          fetchCategories();
        } else {
          // Handle error
          console.error("Failed to add category");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

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
      .then(() => {
        console.log(`Set categories to: ${categories}`);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#f3f3f3",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Administrator Control Panel
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <h4>Add Category</h4>
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
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />

            <TextField
              label="Category Description"
              fullWidth
              required
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />

            <Button variant="contained" type="submit" sx={{ mt: 1 }}>
              Add Category
            </Button>
          </Stack>
        </Box>

        <h4>Add Forum</h4>
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
              onChange={(e) => setNewForum({ ...newForum, name: e.target.value })}
            />

            <TextField
              label="Forum Description"
              fullWidth
              required
              value={newForum.description}
              onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories &&
                  categories.map((category) => (
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
      </Paper>
    </Box>
  );
};

export default AdministratorControlPanelPage;
