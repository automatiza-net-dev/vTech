import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { updateRoute, ActiveIndicator } from "@/presentation";

import {
  TextField as MuiTextField,
  IconButton as MuiIconButton,
  CircularProgress as MuiCircularProgress,
} from "@mui/material";
import MuiSearchIcon from "@mui/icons-material/Search";

import { Error } from "@/presentation";

import { ISearchBar } from "./interfaces";

import * as S from "./styles";

export function SearchBar({  isFetching }: ISearchBar) {
  const router = useRouter();

  const [search, setSearch] = useState(router.query?.search || "");
  const [error, setError] = useState(false);

  function handleChange(ev) {
    setSearch(ev.target.value);

    updateRoute({ params: { search: ev.target.value  }, router });
  }

  useEffect(() => {
    if (search.length > 0) {
      setError(false);
    }
  }, [search]);

  useEffect(() => {
    setSearch(router.query?.search || "");
  }, [router.query?.search]);

  return (
    <Error name="search-table">
      <S.SearchBar $error={!!error}>
        <div className="search">
          <MuiTextField
            onChange={handleChange}
            fullWidth
            placeholder={error ? "Digite o que deseja buscar" : "Pesquisar"}
            error={error}
            disabled={isFetching}
            variant="standard"
            value={search}
          />

          <MuiIconButton
            aria-label="buscar"
            disabled={isFetching}
          >
            {isFetching ? <MuiCircularProgress size={12} /> : <MuiSearchIcon />}
          </MuiIconButton>

          {router.query?.search && <ActiveIndicator />}
        </div>
      </S.SearchBar>
    </Error>
  );
}
